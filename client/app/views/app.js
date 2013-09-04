define(function(require) {
  var Backbone = require('backbone');
  var $ = require('jquery');
  var app = require('app');
  require('bootstrapDropdown');
  var Handlebars = require('handlebars');
  var LoconotViewSingle = require('views/loconot');
  require('templates');

  // App Main View
  // -------------
  return Backbone.View.extend({

    // Bind to the existing skeleton
    el: '#mainApp',

    // Delegated events for creating new items, and clearing completed ones.
    events: {
      'keypress #addressSearch': 'searchAddressOnEnter',
      'click #search-res a': 'secondSelectionByAddress',
      'click #clear-completed': 'clearCompleted',
      'click #toggle-all': 'toggleAllComplete'
    },

    // At initialization we bind to the relevant events on the `Todos`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting todos that might be saved in *localStorage*.
    initialize: function() {
      this.$input = this.$('#new-todo');
      this.$footer = this.$('#footer');
      this.$main = this.$('#main');

      this.listenTo(app.collections.loconots, 'add', this.addOne);
      this.listenTo(app.collections.loconots, 'remove', this.render);
      app.collections.loconots.fetch();
    },

    // // Re-rendering the App just means refreshing the statistics -- the rest
    // // of the app doesn't change.
    // render: function() {
    //   var completed = app.collections.loconots.completed().length;
    //   var remaining = app.collections.loconots.remaining().length;

    //   if ( app.collections.todos.length ) {
    //     this.$main.show();
    //     this.$footer.show();

    //     this.$footer.html(this.statsTemplate({
    //       completed: completed,
    //       remaining: remaining
    //     }));

    //     this.$('#filters li a')
    //       .removeClass('selected')
    //       .filter('[href="#/' + ( app.TodoFilter || '' ) + '"]')
    //       .addClass('selected');
    //   } else {
    //     this.$main.hide();
    //     this.$footer.hide();
    //   }

    //   this.allCheckbox.checked = !remaining;
    // },

    // Add a single todo item to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    addOne: function( note ) {
      var view = new LoconotViewSingle({ model: note });
      $('#loconotsList').append( view.render().el );
    },

    // Add all items in the **Todos** collection at once.
    addAll: function() {
      this.$('#v').html('');
      app.collections.todos.each(this.addOne, this);
    },
    addOneByAddress: function(results, status){
        if (status == google.maps.GeocoderStatus.OK) {
          app.gmap.map.setCenter(results[0].geometry.location);
          var marker = new google.maps.Marker({
              map: app.gmap.map,
              position: results[0].geometry.location
          });
          console.log(results[0]);
          // If more than one res, manual choosing place:
          if(results.length > 1){
            this.$('#search-res').html(Handlebars.templates.resultsSearchAddress({res: results}));
            app.tmp.resSearch = results;
            return;
          }

          app.collections.loconots.create({'address': results[0].formatted_address});
        } else {
          console.log("Geocode was not successful for the following reason: " + status);
        }
    },
    secondSelectionByAddress: function(ev){
      var selection = $(ev.target).data('nb');
      console.log('Selected: ' );
      console.log(app.tmp.resSearch[selection].geometry.location.lat());
      var selectedRes = app.tmp.resSearch[selection];
      var latlng = selectedRes.geometry.location;
      var loconot = {
          address: selectedRes.formatted_address,
          lat: latlng.lat(),
          lng: latlng.lng()
      };
      app.collections.loconots.create(loconot);
      // reset tmp search
      app.tmp.resSearch = null;
      // Empty and hide view
      this.$('#search-res').html('').hide();
    },
    searchAddressOnEnter: function( event ) {
      if ( event.which !== app.keys.enter || !this.$('#addressSearch').val().trim() ) {
        return;
      }
      console.log("Searching address ...");
      app.gmap.search(this.$('#addressSearch').val().trim(), this.addOneByAddress);
      // app.collections.todos.create( this.newAttributes() );
      // this.$input.val('');
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