define(function(require) {
  var Backbone = require('backbone');
  var $ = require('jquery');

  // Loconot Model
  return Backbone.Model.extend({

    // Default attributes ensure that each todo created has `title` and `completed` keys.
    defaults: {
      id: null,
      rate: 0
    },
    validate: function(attrs, options) {
      if (attrs.title === undefined) {
        return "Title need to be set";
      }
    }

  });
});