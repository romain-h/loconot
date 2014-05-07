define(function(require) {
  'use strict';

  var app = require('app');
  var LoconotModel = require('models/loconot');
  var UserModel = require('models/user');
  var LoconotsCol =  require('collections/loconots');
  var AppView = require('views/app');

  // initialization function
  var init = function() {
    // Set window context
    app.window = {};
    app.window.height = $(window).height();
    $('#map-canvas').css({height: app.window.height});

    // Loconot collection singleton
    app.collections.loconots = new LoconotsCol();
    app.models.loconot = LoconotModel;

    // User singleton
    app.models.user = new UserModel();

    Backbone.history.start();

    // Main app view singleton
    app.views.main = new AppView();

    // Load user if connected
    app.loader.start();
    $.get('/api/me', function(){
      app.views.main.trigger('isLoggedIn');
    })
    .fail(function() {
      console.log("User not logged in yet..");
    })
    .always(function() {
      app.loader.done();
    });

    // What is the enter key constant?
    app.keys = {
      enter: 13,
      suppr: 27
    };

    return app;
  };

  // Main entry point when document is ready
  $(document).ready(function () {
      init();
  });

  // Resize window handler to resize map
  $(window).resize(function(){
    app.window.height = $(window).height();
    $('#map-canvas').css({height: app.window.height});
  });
});
