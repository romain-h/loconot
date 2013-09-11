// Set the require.js configuration for your application.
require.config({
  // Initialize the application with the main application file
  deps: ['main'],

  paths: {
    // Libraries
    jquery: '../vendor/js/jquery',
    underscore: '../vendor/js/underscore',
    backbone: '../vendor/js/backbone',
    handlebars: '../vendor/js/handlebars.runtime',
    templates: '../js/build/templates'
  },

  shim: {
    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    handlebars: {
      exports: 'Handlebars'
    },
    templates: {
      deps: ['handlebars']
    }
  }
});