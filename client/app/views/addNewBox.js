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
      console.log(app.views.main);
      app.views.main.trigger('displayMainStatus', 'alert-info', 'Add new');
      this.$el.show();
      this.listenTo(this.model, 'invalid', this.errorHandler);
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
    errorHandler: function(){
      console.log('Error mon pote');
    },
    searchAddress: function( event ) {
      if ( event.which !== app.keys.enter || !this.$('#addressSearch').val().trim() ) {
        return;
      }
      console.log("Searching address ...");
      // Callback addOneByAddress with context on geocoder search
      app.gmap.search(this.$('#addressSearch').val().trim(), this.addOneByAddress.bind(this));
    },
    addFromSearchResult: function(_result){
      var latlng = _result.geometry.location;
      var resAttrs = {
          address: _result.formatted_address,
          lat: latlng.lat(),
          lng: latlng.lng()
      };
      this.model.set(resAttrs, {validate:true});
      app.collections.loconots.add(this.model);
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
            this.resList = results;
            return;
          }
          this.$('#fg-addressSearch').addClass('has-success');
          this.addFromSearchResult(results[0]);
        } else {
          console.log("Geocode was not successful for the following reason: " + status);
        }
    },
    secondSelectionByAddress: function(ev){
      var selection = $(ev.target).data('nb');
      $(ev.target).addClass('active');
      console.log('Selected: ' );
      var selectedRes = this.resList[selection];
      // Empty and hide view
      this.$('#search-res').html('').hide();
    }

  });
});