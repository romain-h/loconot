# Loconot

> Available on http://loconot.herokuapp.com

Have you ever used the stars option on Google Maps? This awesome feature is provided by Google directly into Maps and let users put some stars on their favorites places over the world. Unfortunately it's currently impossible to customize this marker, by adding comments or notes. Then I decided to implement this feature by playing around with Backbone.js.

![Loconot web app](screenshot.png?raw=true)

## Description

The main goal of this project is to get an insight regarding attractives technologies and mainly Backbone.js. This project is my first MV* JS project. It is also a good way to play with an ODM and improving my skills in ruby.

### Design
 - **Backend/Server**: Restfull API - Ruby - Sinatra Framework
 - **Frontend/Client**: Client - JavaScript - Backbone.js Framework
 - **Database**: MongoDB

### Tools
GoogleMapsApi (v3), TwitterApi, Gulp Require.js, Underscore.js, jQuery, Handlebars, Less.

## Requirements

+ Ruby >1.9 
+ MongoDb
+ Nodejs 0.10.x

This app requiere a Twitter application to login. You need to create an app on [https://dev.twitter.com/](https://dev.twitter.com/). If you want to get a temporary one drop me a line.

## Installation
First, clone this project.

Installation on MacOsX 

#### Ruby bundler
```
$ sudo gem install bundler
```

#### Nodejs
Using brew:

```
$ brew install node
```

[Install MongoDb](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/) and run MongoDb.

#### Twitter App credentials
Add credentials into your environment

```
#LOCONOT APPLICATION HEROKU ENV
export LOCONOT_TWITTER_CONSUMER_KEY='YOUR_KEY'
export LOCONOT_TWITTER_CONSUMER_SECRET='YOUR_SECRET'
```

#### Clone project

To install the backend
```
$ cd loconot
$ bundle 
```

Then to install the client use these commands:
```
$ cd loconot/client
$ npm install 
```

## Running the project

### Backend Server
Be sure that MongoDb is running first, then run the Sinatra application:

```
$ rackup config.ru
```

### Client
```
$ cd loconot/client
$ gulp
```

Go to [http://localhost:9292] and enjoy!

