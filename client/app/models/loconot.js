define(function(require) {
  'use strict';

  require('app');

  // Loconot Model
  return Backbone.Model.extend({
    // Add defaults value
    defaults: {
      id: null,
      rate: 0
    },

    validate: function(attrs, options) {
      if (attrs.title === undefined || attrs.title === '') {
        return "Title need to be set";
      }
    }

  });
});
