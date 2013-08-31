class Loconot
    include MongoMapper::Document

    key :title, String, :require => true
    key :long, Float, :require => true
    key :lat, Float, :require => true
    key :address, String
    key :rate,  Integer
end