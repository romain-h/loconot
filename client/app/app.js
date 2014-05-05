define(function(require) {
  'use strict';

  require('backbone');
  var nprogress = require('nprogress');

  var app = {
    // The root path to run the application.
    root: '/',
    views: {},
    models: {},
    collections: {},
    routers: {},
    keys: {},
    loader: nprogress
  };

  return app;
});
