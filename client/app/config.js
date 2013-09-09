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
    backboneLocalstorage: '../vendor/js/backbone.localStorage',
    templates: '../js/build/templates',
    bootstrapDropdown: '../vendor/js/bootstrap/dropdown',
    bootstrapModal: '../vendor/js/bootstrap/modal'
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
      deps: ['handlebars', 'bootstrapModal']
    },
    bootstrapDropdown: {
      deps: ['jquery']
    }
  }
});