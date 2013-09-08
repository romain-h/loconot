define(function(require) {
  var Backbone = require('backbone');
  var $ = require('jquery');
  var app = require('app');
  var Router = require('routers/Router');
  var LoconotModel = require('models/loconot');
  var LoconotsCol =  require('collections/loconots');
  var AppView = require('views/app');

  // initialization function
  var init = function() {
    console.log('Init app');
    // Init filters
    app.TodoFilter = '';
    app.collections.loconots = new LoconotsCol();

    app.models.loconot = LoconotModel;
    app.routers.application = new Router();
    Backbone.history.start();
    app.views.main = new AppView();
    // What is the enter key constant?
    app.keys = {
      enter: 13,
      suppr: 27
    };
    console.log(app);
    app.tmp = {};

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
      // Use new map style
      // google.maps.visualRefresh = true;
      // var styles = [
      //   {
      //     stylers: [
      //       { lightness: 33 },
      //       { saturation: -75 }
      //     ],
      //     elementType: "geometry"

      //   }
      // ];
      //
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



  // google.maps.event.addDomListener(window, 'load', app.gmap.initializeMaps);




  //       var lastMarker;
  //       var newLocation;
  //       var map;
  // function load() {
  //       if (GBrowserIsCompatible()) {
  //           map = new GMap2(document.getElementById("map"));
  //           map.addControl(new GSmallMapControl());
  //           map.addControl(new GMapTypeControl());
  //           map.setCenter(new GLatLng(37.4, -122.1), 13);

  //   // This deletes the marker when clicked on if it is a temporary marker
  //   GEvent.addListener(map, "click", function(marker,point) {
  //   if (marker && marker.openInfoWindowHtml) {
  //               lastMarker = marker;
  //               marker.openInfoWindowHtml("This marker's position is: <b>" + "<br />" + "Latitude: " + marker.getPoint().lat().toString() + "<br />" + "Longitude: " + marker.getPoint().lng().toString()+"</b><br/><a href='javascript:map.removeOverlay(lastMarker);'>remove</a>");
  //   } else if (point) {
  //         newLocation = new GMarker(point);
  //   map.addOverlay(newLocation);
  //               newLocation.openInfoWindowHtml("This marker's position is: <b>" + "<br />" + "Latitude: " + point.lat().toString() + "<br />" + "Longitude: " + point.lng().toString()+"</b><br/><a href='javascript:map.removeOverlay(newLocation);'>remove</a>");
  //               }
  //     });
  //       }
  // }



  $(document).ready(function () {
      test = init();
  });

});