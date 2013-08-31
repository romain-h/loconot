define(function(require) {
  var Backbone = require('backbone');
  var $ = require('jquery');
  var app = require('app');
  var Handlebars = require('handlebars');
  require('templates');

  // Loconot Item View
  // -----------------
  return Backbone.View.extend({

    tagName: 'li',

    // Define current model template
    template: Handlebars.templates.item,

    // The DOM events specific to an item.
    events: {
      'click #addLoconotBtn': 'addNew',
      'dblclick label': 'edit',
      'click #destroyNote': 'clear',
      'keypress .edit': 'updateOnEnter',
      'blur .edit': 'close'
    },

    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Todo** and a **TodoView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.destroy);
      this.listenTo(this.model, 'visible', this.toggleVisible);
    },

    // Re-renders the titles of the todo item.
    render: function() {
      this.$el.addClass('list-group-item').html( this.template( this.model.toJSON() ) );
      return this;
    },

    // Determines if item should be hidden
    toggleVisible : function () {
      this.$el.toggleClass( 'hidden',  this.isHidden());
    },

    // Toggle the `"completed"` state of the model.
    togglecompleted: function() {
      this.model.toggle();
    },

    isHidden : function () {
      var isCompleted = this.model.get('completed');
      return ( // hidden cases only
        (!isCompleted && app.TodoFilter === 'completed')
        || (isCompleted && app.TodoFilter === 'active')
      );
    },

    // View modal add new
    addNew: function(){
      console.log("Add a new loconot");
    },
    // Switch this view into `"editing"` mode, displaying the input field.
    edit: function() {
      this.$el.addClass('editing');
      this.$input.focus();
    },

    // Close the `"editing"` mode, saving changes to the todo.
    close: function() {
      var value = this.$input.val().trim();

      if ( value ) {
        this.model.save({ title: value });
      }

      this.$el.removeClass('editing');
    },

    // If you hit `enter`, we're through editing the item.
    updateOnEnter: function( e ) {
      if ( e.which === app.keys.enter ) {
        this.close();
      }
    },

    // Remove the item, destroy the model and delete its view.
    clear: function() {
      this.model.destroy();
    }
  });
});