define(function(require) {
  'use strict';

  var app = require('app');
  var LoconotModel = require('models/loconot');
  var UserModel = require('models/user');
  var LoconotsCol =  require('collections/loconots');
  var AppView = require('views/app');

  // initialization function
  var init = function() {
    console.log('Init app');
    // Set window context
    app.window = {};
    app.window.height = $(window).height();
    $('#map-canvas').css({height: app.window.height});

    // Loconot collection singleton
    app.collections.loconots = new LoconotsCol();

    app.models.loconot = LoconotModel;
    // User singleton
    app.models.user = new UserModel();
    Backbone.history.start();
    // Main app view singleton
    app.views.main = new AppView();
    // Load user if connected
    $.get('/api/me', function(){
      app.views.main.trigger('isLoggedIn');
    });
    // What is the enter key constant?
    app.keys = {
      enter: 13,
      suppr: 27
    };
    console.log(app);
    return app;
  };


// Google Maps Object Definition
// -----------------------------
   app.GmapApi = function(domId){
    this.initializeMaps(domId);
   };

   app.GmapApi.prototype = {
    constructor: app.GmapApi,
    initializeMaps: function(domId) {
      var self = this;
      // Define style
      var styles = [{"featureType": "landscape.man_made","elementType": "geometry","stylers": [{"color": "#e4e4e4"}]}, {"featureType": "poi.park","elementType": "geometry","stylers": [{"color": "#c5c5c5"}]}, {"featureType": "road","elementType": "geometry.fill","stylers": [{"color": "#ffffff"}]}, {"featureType": "road","elementType": "geometry.stroke","stylers": [{"color": "#c9c9c9"}]}, {"featureType": "road","elementType": "labels.text.stroke","stylers": [{"weight": 0.1}]}, {"featureType": "road","elementType": "labels.icon","stylers": [{"visibility": "off"}]}];

      // Init Map Object
      this.mapOptions = {
        center: new google.maps.LatLng(48.881115099999995, 2.3448237),
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        // mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        panControl: false,
        zoomControl: false,
        styles: styles
      };
      this.map = new google.maps.Map(document.getElementById('map-canvas'), this.mapOptions);

      // Init Geocoder object
      this.geocoder = new google.maps.Geocoder();

      // Add new marker
      // google.maps.event.addListener(this.map, "rightclick", function(event) {
      //     var lat = event.latLng.lat();
      //     var lng = event.latLng.lng();
      //     // populate yor box/field with lat, lng
      //     console.log("Lat=" + lat + "; Lng=" + lng);
      //     var marker = new google.maps.Marker({
      //         map: this.map,
      //         position: event.latLng
      //     });
      //     // Add infos
      //     var infoWin = new google.maps.InfoWindow({
      //       content: "This marker's position is: <b>" + "<br />" + "Latitude: " + event.latLng.lat().toString() + "<br />" + "Longitude: " + event.latLng.lng().toString()+"</b><br/><a href='javascript:map.removeOverlay(lastMarker);'>remove</a>"
      //     });
      //         // Edit new marker
      //   google.maps.event.addListener(marker, "click", function() {
      //     infoWin.open(marker.get('map'), marker);
      //   });
      //     this.map.setCenter(event.latLng);
      // });
    },
    search: function(_address, callback){
      this.geocoder.geocode( { 'address': _address}, callback);
    }
  };

  // Main entry point when document is ready
  $(document).ready(function () {
      init();
  });

  // Resize window handler to resize map
  $(window).resize(function(){
    app.window.height = $(window).height();
    $('#map-canvas').css({height: app.window.height});
  });
});
