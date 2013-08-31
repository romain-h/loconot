define(function(require) {
  var Backbone = require('backbone');
  var $ = require('jquery');

  // Loconot Model
  return Backbone.Model.extend({

    // Default attributes ensure that each todo created has `title` and `completed` keys.
    defaults: {
      id: null,
      title: '',
      lat: '',
      lng: '',
      body: '',
      address: '',
      rate: 0
    }

  });
});