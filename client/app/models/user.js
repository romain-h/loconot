define(function(require) {
  var Backbone = require('backbone');

  // User Model
  // ----------
  return Backbone.Model.extend({
    url: '/api/me'
  });
});