define(function(require) {
  var Backbone = require('backbone');
  var $ = require('jquery');
  var app = require('app');
  var Handlebars = require('handlebars');
  require('templates');

  // AaddNewBox Main View
  // --------------------
  return Backbone.View.extend({
    id: 'addNew',
    className: 'addNewBox',

    // Define current model template
    template: Handlebars.templates.addNewBox,

    initialize: function(){
      this.$el.show();
      this.listenTo(this.model, 'invalid', this.errorHandler);
      this.render();
    },
    render: function () {
      this.$el.html(this.template());
      // set other fields
      this.$otherFields = this.$('#otherFields');
      return this;
    },
    // Delegated events for creating new items, and clearing completed ones.
    events: {
      'keypress #addressSearch': 'searchAddress',
      'click #search-res a': 'secondSelectionByAddress',
      'click #validationBtn': 'updateModel'
    },
    errorHandler: function(){
      console.log('Error mon pote');
    },
    setCurrentViewAddress: function(_address){
      // Empty tmp results
      this.resList = null;
      // Empty and hide view list of results
      this.$('#search-res').html('').hide();
      this.currentAddress = _address;
      // Center map on selected address
      app.gmap.map.setCenter(_address.geometry.location);
      var marker = new google.maps.Marker({
          map: app.gmap.map,
          position: _address.geometry.location
      });
      // Replace input value
      this.$('#addressSearch').val(this.currentAddress.formatted_address);
      // Add success green class
      this.$('#fg-addressSearch').addClass('has-success');
      // Display other fields
      this.$otherFields.show();
    },
    searchAddress: function( event ) {
      console.log('touch');
      if ( event.which !== app.keys.enter || !this.$('#addressSearch').val().trim() ) {
        // DO BETTER EMPTY DETECTION...
        this.$('#fg-addressSearch').removeClass('has-success');
        this.$otherFields.hide();
        return;
      }
      console.log("Searching address ...");
      // Callback findAddress with context on geocoder search
      app.gmap.search(this.$('#addressSearch').val().trim(), this.findAddress.bind(this));
    },
    updateModel: function(){
      var latlng = this.currentAddress.geometry.location;
      var resAttrs = {
          address: this.currentAddress.formatted_address,
          lat: latlng.lat(),
          lng: latlng.lng(),
          title: this.$otherFields.find('#newTitle').val().trim(),
          body: this.$otherFields.find('#newNote').val().trim()
      };
      this.model.set(resAttrs, {validate:true});
      app.collections.loconots.create(this.model);
      app.views.main.trigger('displayMainStatus', 'alert-success', resAttrs.title + ' added as a new loconot.');
      app.views.main.trigger('removeAddbox');
    },
    findAddress: function(results, status){
        if (status == google.maps.GeocoderStatus.OK) {
          // If more than one res, manual choosing place:
          if(results.length > 1){
            this.$('#search-res').html(Handlebars.templates.resultsSearchAddress({res: results})).show();
            this.resList = results;
            return;
          }
          this.setCurrentViewAddress(results[0]);
        } else {
          console.log("Geocode was not successful for the following reason: " + status);
        }
    },
    secondSelectionByAddress: function(ev){
      // Get the # selected
      var selection = $(ev.target).data('nb');
      // Set current view address with selection
      this.setCurrentViewAddress(this.resList[selection]);
    }

  });
});