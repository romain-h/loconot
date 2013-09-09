define(function(require) {
  var Backbone = require('backbone');
  var $ = require('jquery');

  // User Model
  // ----------
  return Backbone.Model.extend({
    url: '/api/me'

  });
});