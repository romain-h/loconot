define(function(require) {
  'use strict';

  var app = require('app');
  var CustomMapApi = require('helpers/googlemaps');
  var LoconotViewSingle = require('views/loconot');
  var UserViewSingle = require('views/user');
  var AddNewBoxView = require('views/addNewBox');

  // App Main View
  // -------------
  return Backbone.View.extend({

    // Bind to the existing skeleton
    el: '#mainApp',

    // Delegated events
    events: {
      'click #addLoconotBtn': 'displayAddNewBox',
      'click #clear-completed': 'clearCompleted',
      'click #toggle-all': 'toggleAllComplete',
      'click #connect': 'login'
    },

    // At initialization we bind to the relevant events on the collection
    // and this view
    initialize: function() {
      this.listenTo(app.collections.loconots, 'add', this.addOne);
      this.listenTo(this, 'isLoggedIn', this.loginCallback);
      this.listenTo(this, 'displayMainStatus', this.status);
      this.listenTo(this, 'removeAddbox', this.removeAddBox);
      app.collections.loconots.fetch();
      // Set map dom on load
      app.gmap = new CustomMapApi('map-canvas');

      this.$addBtn = this.$('#addLoconotBtn');
      this.$status = this.$('#statusBox');
      // Hide button
      this.$addBtn.hide();
    },

    // Status box handler to display any message for the user
    // like error or info message.
    // Type: 'alert-info', 'alert-warning', 'alert-danger' are posssible value
    status: function(type, content){
      this.$status.addClass(type);
      this.$status.find('.container').html(content);
      this.$status.fadeIn().delay(1200).fadeOut();
    },

    // Diplay box to add a new loconot
    displayAddNewBox: function(){
      console.log("Display New AddBox");
      this.$addBtn.hide();
      this.addView = new AddNewBoxView({ model: new app.models.loconot() });
      $('body').append(this.addView.render().el);
    },

    // Remove add box at the end
    removeAddBox: function(){
      this.$addBtn.show();
      this.addView.remove();
    },

    // Add a new elt into main list of loconots
    addOne: function( note ) {
      var view = new LoconotViewSingle({ model: note });
      $('#loconotsList').append( view.render().el );
    },

    // Add all items in the loconots collection at once.
    addAll: function() {
      app.collections.todos.each(this.addOne, this);
    },

    // Login popup
    login: function(){
      var options = 'location=0,status=0,width=800,height=400';
      var loginpopup  = window.open('/auth/login', 'Login Twitter', options);
      var callback = this.loginCallback.bind(this);
      var oauthInterval = window.setInterval(function(){
                  if (loginpopup.closed) {
                      window.clearInterval(oauthInterval);
                      console.log("LOGGED IN");
                      callback();
                  }
        }, 1000);
    },

    // Login Callback
    loginCallback: function(){
      var userView = new UserViewSingle({ model: app.models.user });
      // Refetch collection for connected user
      app.collections.loconots.fetch();
      this.$addBtn.show();
    }

  });
});
