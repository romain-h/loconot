// Set the require.js configuration for your application.
require.config({
  // Initialize the application with the main application file
  deps: ['main'],

  paths: {
    // Libraries
    bootstrapDropdown: '../bower_components/bootstrap/js/dropdown',
    bootstrapModal: '../bower_components/bootstrap/js/modal',
    jquery: '../bower_components/jquery/dist/jquery',
    underscore: '../bower_components/underscore/underscore',
    backbone: '../bower_components/backbone/backbone',
    handlebars: '../vendor/js/handlebars.runtime',
    templates: 'templates/precompiled/templates'
  },

  shim: {
    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    bootstrapDropdown: {
      deps: ['jquery']
    },
    bootstrapModal: {
      deps: ['jquery']
    },
    handlebars: {
      exports: 'Handlebars'
    },
    templates: {
      deps: ['handlebars']
    }
  }
});
