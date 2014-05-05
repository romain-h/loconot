define(function(require) {
  'use strict';

  require('app');

  // User Model
  // ----------
  return Backbone.Model.extend({
    url: '/api/me'
  });
});
