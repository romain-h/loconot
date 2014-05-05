define(function(require) {
  'use strict';

  require('backbone');
  var app = {
    // The root path to run the application.
    root: '/',
    views: {},
    models: {},
    collections: {},
    routers: {},
    keys: {}
  };

  return app;
});
