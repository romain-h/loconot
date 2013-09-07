define(function(require) {
  var Backbone = require('backbone');
  var $ = require('jquery');
  var app = require('app');
  require('bootstrapDropdown');
  var Handlebars = require('handlebars');
  var LoconotViewSingle = require('views/loconot');
  var AddNewBoxView = require('views/AddNewBox');
  require('templates');

  // App Main View
  // -------------
  return Backbone.View.extend({

    // Bind to the existing skeleton
    el: '#mainApp',

    // Delegated events for creating new items, and clearing completed ones.
    events: {
      'click #addLoconotBtn': 'displayAddNewBox',
      'click #clear-completed': 'clearCompleted',
      'click #toggle-all': 'toggleAllComplete'
    },

    // At initialization we bind to the relevant events on the `Todos`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting todos that might be saved in *localStorage*.
    initialize: function() {
      this.listenTo(app.collections.loconots, 'add', this.addOne);
      this.listenTo(app.collections.loconots, 'remove', this.render);
      this.listenTo(this, 'displayMainStatus', this.status);
      app.collections.loconots.fetch();
      // Set map dom on load
      app.gmap = new app.GmapApi('map-canvas');

      this.$status = $('body #statusBox');
    },
    status: function(type, content){
      /** --------
      // alert-success">...</div>
      <div class="alert alert-info">...</div>
      <div class="alert alert-warning">...</div>
      <div class="alert alert-danger
      **/
      this.$status.addClass(type);
      this.$status.find('.container').html(content);
      this.$status.fadeIn().delay(1200).fadeOut();
    },
    displayAddNewBox: function(){
      console.log("Display New AddBox");
      var view = new AddNewBoxView({ model: new app.models.loconot() });
    },
    addOne: function( note ) {
      var view = new LoconotViewSingle({ model: note });
      $('#loconotsList').append( view.render().el );
    },

    // Add all items in the **Todos** collection at once.
    addAll: function() {
      this.$('#v').html('');
      app.collections.todos.each(this.addOne, this);
    }

    // filterOne : function (todo) {
    //   todo.trigger('visible');
    // },

    // filterAll : function () {
    //   app.collections.todos.each(this.filterOne, this);
    // },

    // // Generate the attributes for a new Todo item.
    // newAttributes: function() {
    //   var ret = {
    //     title: this.$input.val().trim(),
    //     order: app.collections.todos.nextOrder(),
    //     completed: false
    //   };
    //   return ret;
    // },

    // // If you hit return in the main input field, create new Todo model,
    // // persisting it to localStorage.
    // createOnEnter: function( event ) {
    //   if ( event.which !== app.keys.enter || !this.$input.val().trim() ) {
    //     return;
    //   }
    //   app.collections.todos.create( this.newAttributes() );
    //   this.$input.val('');
    // },

    // // Clear all completed todo items, destroying their models.
    // clearCompleted: function() {
    //   _.invoke(app.collections.todos.completed(), 'destroy');
    //   return false;
    // },

    // toggleAllComplete: function() {
    //   var completed = this.allCheckbox.checked;

    //   app.collections.todos.each(function( todo ) {
    //     todo.save({
    //       'completed': completed
    //     });
    //   });
    // }
    //

  });
});