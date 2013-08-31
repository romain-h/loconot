require 'rack/cors'
require 'sinatra'
require 'sinatra/reloader' if development?
require "sinatra/config_file"
require 'mongo_mapper'
require 'json'
require 'yaml'
require 'twitter_oauth'
require 'dalli'


class LoconotApp < Sinatra::Base
    register Sinatra::Contrib
    register Sinatra::ConfigFile

        use Rack::Cors do
            allow do
                origins 'localhost:9292', 'localhost:8000'
                resource '*', :headers => :any, :methods => [:get, :post, :options, :put, :delete]
            end
        end
    config_file 'config/env.yml'

    configure do
        set :allow_origin, :any
        if settings.production?
            MongoMapper.setup({'production' => {'uri' => ENV['MONGODB_URI']}}, 'production')
        else
            MongoMapper.setup({'development' => settings.db}, 'development')
            # if ENV['MONGOHQ_URL']
            # puts "Running on MongoHQ"
            # uri = URI.parse(ENV['MONGOHQ_URL'])
            # MongoMapper.connection = Mongo::Connection.new(uri.host, uri.port)
            # MongoMapper.database = uri.path.gsub(/^\//, '')
            # MongoMapper.database.authenticate(uri.user, uri.password)
        end
    end
    ## Def Models
    class Loconot
        include MongoMapper::Document

        key :title, String, :require => true
        key :lng, Float, :require => true
        key :lat, Float, :require => true
        key :body, String
        key :address, String
        key :rate,  Integer

        attr_accessible :title, :lng, :lat, :body, :address, :rate
    end

    class User
        include MongoMapper::Document

        key :twitter_id, Integer
        key :name, String
        key :access_token, String, :require => true
        key :access_token_secret, String, :require => true
    end

    before do
        # Init oauth twitter client
        @client = TwitterOAuth::Client.new(
            :consumer_key => settings.twitter['consumer_key'],
            :consumer_secret => settings.twitter['consumer_secret']
        )
        # Init memcached client
        @memc = Dalli::Client.new('localhost:11211', { :namespace => 'loconot'})
    end

    ## API
    get '/' do
        backup = "#{settings.twitter}"
        firstNote = Loconot.all()
        firstNote.each { |i|
            puts i.title.to_s
        }

        # firstNote = Loconot.create({:title => "Premiere note Youhou", :lng => 324524.2, :lat => 23423423})
        # firstNote.save!
        return "#{session} #{firstNote.to_json}"
    end

    get '/api/loconots' do
        notes = Loconot.all()
        return notes.to_json
    end

    get '/api/loconots/:id.?:format?' do
        note = Loconot.find_by_id(params[:id])
        if params[:format] == 'xml'
            content_type 'application/xml'
            return note.to_xml
        else
            content_type 'application/json'
            return note.to_json
        end
    end

    post '/api/loconots' do
        data = JSON.parse(request.body.read)
        puts data
        # try?
        note = Loconot.create(data)
        note.save!
        return note.to_json
    end

    put '/api/loconots/:id' do
        note = Loconot.find_by_id(params[:id])
        data = JSON.parse(request.body.read)

        status 200
    end

    delete '/api/loconots/:id' do
        Loconot.destroy(params[:id])

        status 200
    end

    # put '/api/loconots/:id' do
    #     note = Loconot.find_by_id(params[:id])
    #     note.
    # end
    get '/auth/login' do
        request_token = @client.authentication_request_token(:oauth_callback => 'http://localhost:9292/twitter_callback')
        puts "First TOKEN"
        puts request_token.token
        puts request_token.secret
        # Store linked token_secret into memcached
          @memc.set(request_token.token, request_token.secret)

        redirect request_token.authorize_url
    end
    get '/twitter_callback' do
        # Get previous secret stored into memcached
        token_secret = @memc.get(params[:oauth_token])
          # Exchange the request token for an access token.
          @access_token = @client.authorize(
            params[:oauth_token],
            token_secret,
            :oauth_verifier => params[:oauth_verifier]
          )

          puts @memc.get(params[:oauth_token])

        if @client.authorized?
            # Storing the access tokens so we don't have to go back to Twitter again
            current_user = User.find_by_access_token(@access_token.token)
            if !current_user
                @user_info = @client.info

                current_user = User.create({:twitter_id => @user_info['id'],
                                            :name => @user_info['name'],
                                            :access_token => @access_token.token,
                                            :access_token_secret => @access_token.secret
                                            })
                current_user.save!
            end
            return "#{current_user.to_json}"
        end
    end

end