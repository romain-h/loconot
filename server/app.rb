require 'rack/cors'
require 'sinatra'
require 'sinatra/reloader' if development?
require "sinatra/config_file"
require 'mongo_mapper'
require 'json'
require 'yaml'
require 'twitter_oauth'

# Load path for models
$:.unshift File.join(File.dirname(__FILE__),'models')
require 'Loconot'
require 'User'


class LoconotApp < Sinatra::Base
    register Sinatra::Contrib
    register Sinatra::ConfigFile
    config_file 'config/env.yml'
    enable :sessions
    set :public_folder, File.dirname(__FILE__) + '/../client/'

    # Handle CORS ..
    # Not used anymore since we choosed to serve client directly with rackup
    use Rack::Cors do
        allow do
            origins 'localhost:9292', 'localhost:8000'
            resource '*', :headers => :any, :methods => [:get, :post, :options, :put, :delete]
        end
    end

    configure do
        set :allow_origin, :any
        if settings.production?
            MongoMapper.setup({'production' => settings.db}, 'production')
        else
            MongoMapper.setup({'development' => settings.db}, 'development')
            if ENV['MONGOHQ_URL']
                puts "Running on MongoHQ"
                uri = URI.parse(ENV['MONGOHQ_URL'])
                MongoMapper.connection = Mongo::Connection.new(uri.host, uri.port)
                MongoMapper.database = uri.path.gsub(/^\//, '')
                MongoMapper.database.authenticate(uri.user, uri.password)
            end
        end
    end

    helpers do
        # Useful method to check if the current request is signed by cookie
        def tryAccessToken
            if session[:access_token].nil?
                haltCustom(401, 'Authentication is required to access this resource.')
            end
        end

        # Custom halt methode to return std json content
        def haltCustom(status_code, message)
            content = {:status => "error",
            :status_code => status_code,
            :message => message
            }
            halt status_code, content.to_json
        end
    end

    before do
        # This is an api only so we handle only json here
        content_type 'application/json'
    end

    ## Static client
    # From now we are gonna use rackup to serve static client
    get '/' do
        content_type 'text/html'
        send_file File.join(settings.public_folder, 'index.html')
    end

    ## API
    # GET All loconot ressources
    get '/api/loconots' do
        tryAccessToken
        puts session[:user_id]
        notes = Loconot.find_all_by_user_id(session[:user_id].to_s)
        # Add null test
        puts notes.to_json
        return notes.to_json
    end

    # GET a loconot ressource by id
    get '/api/loconots/:id' do
        tryAccessToken
        note = Loconot.find_by_id(params[:id])
        haltCustom(404, 'The ressource has not been found') if note.nil?
        # Add test on current user_id
        haltCustom(403, 'Ressource access forbidden') if note.user_id != session[:user_id]
        return note.to_json
    end

    # POST new loconot ressource
    post '/api/loconots' do
        tryAccessToken
        data = JSON.parse(request.body.read)
        # Add current user id
        data[:user_id] = session[:user_id]
        # TODO add a condition on data. try/catch MongoMapper::DocumentNotValid
        note = Loconot.create(data)
        note.save!
        return note.to_json
    end

    # PUT Modify an existing loconot ressource
    put '/api/loconots/:id' do
        tryAccessToken
        note = Loconot.find_by_id(params[:id])
        # TODO add a condition on data?!!
        data = JSON.parse(request.body.read)
        status 200
    end

    # DELETE an existing loconot ressource
    delete '/api/loconots/:id' do
        tryAccessToken
        begin
           Loconot.destroy(params[:id])
        # Catch MongoMapper Exception on not found
        rescue MongoMapper::DocumentNotFound
            haltCustom(404, 'The ressource has not been found')
        end
        status 204
    end

    get '/api/me' do
        tryAccessToken
        @client = TwitterOAuth::Client.new(
            :consumer_key => settings.twitter[:consumer_key],
            :consumer_secret => settings.twitter[:consumer_secret],
            :token => session[:access_token],
            :secret => session[:secret_token]
        )
        currentUser = User.find_by_access_token(session[:access_token])
        haltCustom(404, 'The ressource has not been found') if currentUser.nil?
        return @client.info.to_json
    end
    # Authentification section
    # ------------------------

    # Login with Twitter Oauth
    get '/auth/login' do
        # Init oauth twitter client
        @client = TwitterOAuth::Client.new(
            :consumer_key => settings.twitter[:consumer_key],
            :consumer_secret => settings.twitter[:consumer_secret]
        )

        request_token = @client.authentication_request_token(:oauth_callback => 'http://localhost:9292/twitter_callback')
        # Store linked token_secret into memcached
        session[:request_token_secret] = request_token.secret
        redirect request_token.authorize_url
    end

    # Twitter Callback
    get '/twitter_callback' do
        # Init oauth twitter client
        @client = TwitterOAuth::Client.new(
            :consumer_key => settings.twitter[:consumer_key],
            :consumer_secret => settings.twitter[:consumer_secret]
        )
        # Get previous secret stored into memcached
        token_secret = session[:request_token_secret]
          # Exchange the request token for an access token.
          @access_token = @client.authorize(
            params[:oauth_token],
            token_secret,
            :oauth_verifier => params[:oauth_verifier]
          )

          # puts @memc.get(params[:oauth_token])

        if @client.authorized?
            # Storing the access tokens so we don't have to go back to Twitter again
            session[:access_token] = @access_token.token
            session[:secret_token] = @access_token.secret
            current_user = User.find_by_access_token(@access_token.token)
            if !current_user
                @user_info = @client.info

                current_user = User.create({:twitter_id => @user_info[:id],
                                            :name => @user_info[:name],
                                            :access_token => @access_token.token,
                                            :access_token_secret => @access_token.secret
                                            })
                current_user.save!
            end
            session[:user_id] = current_user.id

            puts session[:user_id]
            # Return script to close login popup
            content_type 'text/html'
            <<-HTML
              <script>
              window.close();
              </script>
            HTML
        end
    end

    # Logout by destroying current session
    get '/logout' do
        session.clear
        redirect '/'
    end
end