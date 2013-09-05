define(function(require) {
  var Backbone = require('backbone');
  var $ = require('jquery');
  var app = require('app');
  var Handlebars = require('handlebars');
  require('templates');

  // AaddNewBox Main View
  // --------------------
  return Backbone.View.extend({
    el: '#addNew',

    // Define current model template
    template: Handlebars.templates.addNewBox,

    initialize: function(){
      this.$el.show();
      this.render();
    },
    render: function () {
        this.$el.html(this.template());
        return this;
    },
    // Delegated events for creating new items, and clearing completed ones.
    events: {
      'keypress #addressSearch': 'searchAddress',
      'click #search-res a': 'secondSelectionByAddress',
    },
    searchAddress: function( event ) {
      if ( event.which !== app.keys.enter || !this.$('#addressSearch').val().trim() ) {
        return;
      }
      console.log("Searching address ...");
      app.gmap.search(this.$('#addressSearch').val().trim(), this.addOneByAddress);
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
            this.$('#fg-addressSearch').addClass('has-success');
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
      $(ev.target).addClass('active');
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

  });
});