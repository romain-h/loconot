class User
    include MongoMapper::Document

    key :twitter_id, Integer
    key :name, String
    key :access_token, String, :require => true
    key :access_token_secret, String, :require => true
end