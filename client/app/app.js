define(function(require) {
  'use strict';

  require('backbone');
  var customLoader = require('helpers/progressbar');

  var app = {
    // The root path to run the application.
    root: '/',
    views: {},
    models: {},
    collections: {},
    routers: {},
    keys: {},
    loader: customLoader
  };

  return app;
});
