define(function(require) {
  'use strict';

// Google map class wrapper
// -----------------------------
  var MapApi = function(domId){
    this.initializeMaps(domId);
  };

  MapApi.prototype.constructor = MapApi;

  MapApi.prototype.initializeMaps = function(domId) {
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

    this.map = new google.maps.Map(document.getElementById(domId), this.mapOptions);

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
  };

  MapApi.prototype.search = function(_address, callback){
    this.geocoder.geocode( { 'address': _address}, callback);
  }

  return MapApi;
});
