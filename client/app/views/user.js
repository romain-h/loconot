define(function(require) {
  'use strict';

  var app = require('app');
  var template = require('templates/user');

  // User View
  // ---------
  return Backbone.View.extend({
    el: '#login',

    // Define current model template
    template: template,

    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.model.fetch();
    },

    render: function() {
      var tpl = this.template(this.model.toJSON());
      this.$el.html(tpl);

      return this;
    }
  });
});
