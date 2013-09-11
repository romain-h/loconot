define(function(require) {
  var Backbone = require('backbone');

  // Loconot Model
  return Backbone.Model.extend({
    // Add defaults value
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