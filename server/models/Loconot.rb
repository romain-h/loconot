class Loconot
    include MongoMapper::Document

    key :user_id, String, :require => true
    key :title, String, :require => true
    key :lng, Float, :require => true
    key :lat, Float, :require => true
    key :body, String
    key :address, String
    key :rate,  Integer

    attr_accessible :user_id, :title, :lng, :lat, :body, :address, :rate
end