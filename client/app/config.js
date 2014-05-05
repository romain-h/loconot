// Set the require.js configuration for your application.
require.config({
  // Initialize the application with the main application file
  deps: ['main'],

  paths: {
    // Libraries
    backbone: '../bower_components/backbone/backbone',
    bootstrapDropdown: '../bower_components/bootstrap/js/dropdown',
    bootstrapModal: '../bower_components/bootstrap/js/modal',
    handlebars: '../vendor/js/handlebars.runtime',
    jquery: '../bower_components/jquery/dist/jquery',
    nprogress: '../bower_components/nprogress/nprogress',
    templates: 'templates/precompiled/templates',
    underscore: '../bower_components/underscore/underscore',
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
    jquery: {
      exports: 'jQuery'
    },
    nprogress: {
      exports: 'nprogress'
    },
    templates: {
      deps: ['handlebars']
    }
  }
});
