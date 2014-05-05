define(function(require) {
  var Backbone = require('backbone');
  var $ = require('jquery');
  var app = require('app');
  var template = require('templates/user')

  // User View
  // ---------
  return Backbone.View.extend({
    el: '#login',

    // Define current model template
    template: template,

    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      console.log("NEW USER VIEW");
      this.model.fetch();
    },

    render: function() {
      this.$el.html( this.template( this.model.toJSON() ) );
      return this;
    }
  });
});
