define(function(require) {
  'use strict';

  var app = require('app');
  var template = require('templates/addNewBox');
  var resultsSearch = require('templates/resultsSearchAddress');

  // AaddNewBox Main View
  // --------------------
  return Backbone.View.extend({
    id: 'addNew',
    className: 'addNewBox',

    // Define current model template
    template: template,

    initialize: function(){
      this.$el.show();
      this.listenTo(this.model, 'invalid', this.errorHandler);
      this.render();
    },

    // Render new box view
    render: function () {
      this.$el.html(this.template());

      // set other fields
      this.$otherFields = this.$('#otherFields');

      return this;
    },

    // Delegated events for creating new item
    events: {
      'keypress #addressSearch': 'searchAddress',
      'click #search-res a': 'secondSelectionByAddress',
      'click #validationBtn': 'updateModel'
    },

    errorHandler: function(){
      console.log('Error on model');
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

    // Search an address on enter with input value
    searchAddress: function( event ) {
      var isSearchable = event.which !== app.keys.enter ||
                         !this.$('#addressSearch').val().trim();

      if (isSearchable) {
        this.$('#fg-addressSearch').removeClass('has-success');
        this.$otherFields.hide();
        return;
      }

      // Callback findAddress with context on geocoder search
      var addressToFind = this.$('#addressSearch').val().trim();
      app.gmap.search(addressToFind, this.findAddress.bind(this));
    },

    // Update current model with more informations
    updateModel: function(){
      var latlng = this.currentAddress.geometry.location;
      var title = this.$otherFields.find('#newTitle').val().trim();
      var body = this.$otherFields.find('#newNote').val().trim();

      var loconotAttrs = {
          address: this.currentAddress.formatted_address,
          lat: latlng.lat(),
          lng: latlng.lng(),
          title: title,
          body: body
      };

      // Store new model loconot
      this.model.set(loconotAttrs, { validate:true });
      app.collections.loconots.create(this.model);

      // Notify user
      app.views.main.trigger('displayMainStatus', 'alert-success', loconotAttrs.title + ' added as a new loconot.');
      app.views.main.trigger('removeAddbox');
    },

    // Geocoder search callback
    findAddress: function(results, status){
      var that = this;
        if (status == google.maps.GeocoderStatus.OK) {

          // If more than one res, manual choosing place:
          if(results.length > 1){
            // Fix max size to avoid overflow
            var _height = app.window.height - 155;
            this.$('#search-res').css({ height:  _height})
                                 .html(resultsSearch({res: results}))
                                 .show();

            this.resList = results;
            return;
          }
          this.setCurrentViewAddress(results[0]);
        } else {
          console.log("Geocode was not successful for the following reason: " + status);
        }
    },

    // seconde selection event
    secondSelectionByAddress: function(ev){
      // Get the # selected
      var selection = $(ev.target).data('nb');
      // Set current view address with selection
      this.setCurrentViewAddress(this.resList[selection]);
    }

  });
});
