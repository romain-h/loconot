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
    app.keys = {enter: 13};
    console.log(app);

    return app;
  };


// Google Maps functions
// ---------------------
  var initializeMaps = function() {
    google.maps.visualRefresh = true;
    var geocoder = new google.maps.Geocoder();

    var mapOptions = {
      center: new google.maps.LatLng(48.881115099999995, 2.3448237),
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map-canvas"),
        mapOptions);
    app.map = map;
    geocoder.geocode( { 'address': '3 rue baliat Courbevoie'}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
        });
        console.log(marker);
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });

    // Add new marker
    google.maps.event.addListener(map, "rightclick", function(event) {
        var lat = event.latLng.lat();
        var lng = event.latLng.lng();
        // populate yor box/field with lat, lng
        console.log("Lat=" + lat + "; Lng=" + lng);
        var marker = new google.maps.Marker({
            map: map,
            position: event.latLng
        });
        // Add infos
        var infoWin = new google.maps.InfoWindow({
          content: "This marker's position is: <b>" + "<br />" + "Latitude: " + event.latLng.lat().toString() + "<br />" + "Longitude: " + event.latLng.lng().toString()+"</b><br/><a href='javascript:map.removeOverlay(lastMarker);'>remove</a>"
        });
            // Edit new marker
      google.maps.event.addListener(marker, "click", function() {
        infoWin.open(marker.get('map'), marker);
      });
        map.setCenter(event.latLng);
    });



  };

  // Set map dom on load
  google.maps.event.addDomListener(window, 'load', initializeMaps);

  var search = function(){
    var addressField = document.getElementById('search_address');
    geocoder.geocode( { 'address': addressField.value}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
        });
        console.log(marker);
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  };


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