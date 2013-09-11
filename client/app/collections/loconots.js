define(function(require) {
  var Backbone = require('backbone');
  var LoconotModel = require('models/loconot');

  // Loconot Collection
  // ---------------
  return Backbone.Collection.extend({

    model: LoconotModel,

    // Api storage link
    url: '/api/loconots'
  });
});