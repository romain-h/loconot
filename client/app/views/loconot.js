define(function(require) {
  require('templates');
  var Backbone = require('backbone');
  var $ = require('jquery');
  var app = require('app');
  var Handlebars = require('handlebars');

  // Loconot Item View
  // -----------------
  return Backbone.View.extend({

    tagName: 'a',
    className: 'list-group-item',

    // Define current model template
    template: Handlebars.templates.item,

    // The DOM events specific to an item.
    events: {
      'click': 'moreInfo',
      'dblclick label': 'edit',
      'click #destroyNote': 'clear',
      'keypress .edit': 'updateOnEnter',
      'blur .edit': 'close'
    },
    // Init item view
    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.destroy);
      this.listenTo(this.model, 'visible', this.toggleVisible);
      this.position = new google.maps.LatLng(this.model.get('lat'), this.model.get('lng'));
    },

    // Render item and also gmap marker
    render: function() {
      this.$el.html( this.template( this.model.toJSON() ) );
      this.renderMapMarker();
      this.$titlePreview = this.$('#titlePreview');
      this.$moreInfo = this.$('#moreInfo');
      return this;
    },

    // Gmap marker
    renderMapMarker: function(){
      this.markerGM = new google.maps.Marker({
          map: app.gmap.map,
          position: this.position
      });
      // Add infos
      // TODO: Use handlebars template for this
      this.markerInfoGM = new google.maps.InfoWindow({
          content: "Title = "+this.model.get('title')+"<b>" + "<br />" + "Latitude: " +this.model.get('lat') + "<br />" + "Longitude: " + this.model.get('lng')+"</b><br/><a href='javascript:map.removeOverlay(lastMarker);'>remove</a>"
      });
      // Edit new marker
      var win = this.markerInfoGM;
      var mark = this.markerGM;
      google.maps.event.addListener(this.markerGM, "click", function() {
        win.open(app.gmap.map, mark);
      });
    },

    // On item click focuse map on current marker
    focuseMap: function(){
      app.gmap.map.setCenter(this.position);
    },

    // Display more info on click
    moreInfo: function(){
      console.log(this);
      this.$titlePreview.hide();
      this.$moreInfo.show();
      this.focuseMap();
    },

    // Remove the item, destroy the model and delete its view.
    clear: function() {
      console.log('Destroying model');
      // Remove marker
      this.markerGM.setMap(null);
      // Remove from server
      this.model.destroy();
      //  Remove current view
      this.remove();
    }
  });
});