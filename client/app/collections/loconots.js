define(function(require) {
  'use strict';

  require('app');
  var LoconotModel = require('models/loconot');

  // Loconot Collection
  // ---------------
  return Backbone.Collection.extend({

    model: LoconotModel,

    // Api storage link
    url: '/api/loconots'
  });
});
