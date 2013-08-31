define(function(require) {
  var Backbone = require('backbone');
  var $ = require('jquery');
  var app = require('app');
  var LoconotModel = require('models/loconot');

  // Loconot Collection
  // ---------------
  return Backbone.Collection.extend({

    model: LoconotModel,

    // Api storage link
    url: 'http://localhost:9292/api/loconots'
  });
});