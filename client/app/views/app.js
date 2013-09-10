define(function(require) {
  var Backbone = require('backbone');
  var $ = require('jquery');
  var app = require('app');
  require('bootstrapDropdown');
  var Handlebars = require('handlebars');
  var LoconotViewSingle = require('views/loconot');
  var UserViewSingle = require('views/user');
  var AddNewBoxView = require('views/addNewBox');
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
      'click #toggle-all': 'toggleAllComplete',
      'click #connect': 'login'
    },

    // At initialization we bind to the relevant events on the `Todos`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting todos that might be saved in *localStorage*.
    initialize: function() {
      this.listenTo(app.collections.loconots, 'add', this.addOne);
      this.listenTo(app.collections.loconots, 'change', this.render);
      this.listenTo(app.collections.loconots, 'remove', this.render);
      this.listenTo(this, 'isLoggedIn', this.loginCallback);
      this.listenTo(this, 'displayMainStatus', this.status);
      this.listenTo(this, 'removeAddbox', this.removeAddBox);
      app.collections.loconots.fetch();
      // Set map dom on load
      app.gmap = new app.GmapApi('map-canvas');

      this.$addBtn = this.$('#addLoconotBtn');
      this.$status = this.$('#statusBox');
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
      this.$addBtn.hide();
      this.addView = new AddNewBoxView({ model: new app.models.loconot() });
      $('body').append(this.addView.render().el);
    },
    removeAddBox: function(){
      this.$addBtn.show();
      this.addView.remove();
    },
    addOne: function( note ) {
      var view = new LoconotViewSingle({ model: note });
      $('#loconotsList').append( view.render().el );
    },

    // Add all items in the **Todos** collection at once.
    addAll: function() {
      this.$('#v').html('');
      app.collections.todos.each(this.addOne, this);
    },

    login: function(){
      var options = 'location=0,status=0,width=800,height=400';
      var loginpopup  = window.open('/auth/login', 'Login Twitter', options);
      var callback = this.loginCallback;
      var oauthInterval = window.setInterval(function(){
                  if (loginpopup.closed) {
                      window.clearInterval(oauthInterval);
                      console.log("LOGGED IN");
                      callback();
                  }
        }, 1000);
    },

    loginCallback: function(){
      var userView = new UserViewSingle({model: new app.models.user()});
      app.collections.loconots.fetch();
      // app.user = new app.models.user();
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