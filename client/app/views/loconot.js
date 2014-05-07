define(function(require) {
  'use strict';

  var app = require('app');
  var template = require('templates/item');
  var markerTpl = require('templates/infoMarker');

  // Loconot Item View
  // -----------------
  return Backbone.View.extend({

    tagName: 'a',

    className: 'list-group-item',

    // Define current model template
    template: template,

    // The DOM events specific to an item.
    events: {
      'dblclick label': 'edit',
      'click #destroyNote': 'clear',
      'keypress .edit': 'updateOnEnter',
      'blur .edit': 'close'
    },

    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.destroy);
      this.position = new google.maps.LatLng(this.model.get('lat'), this.model.get('lng'));
      this.listenTo(app.views.main, 'toggleFocusNote', this.toggleView);
      this.isFocused = false;
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
      var contentMarker = {
        title: this.model.get('title'),
        note: this.model.get('body')
      };

      this.markerInfoGM = new google.maps.InfoWindow({
        content: markerTpl(contentMarker)
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
    // and hide opened notes
    toggleView: function(ev){
      var clickedId = $(ev.target).data('id');
      var isToToggle = ((this.model.get('id') !== clickedId) && this.isFocused) ||
                        (this.model.get('id') === clickedId && !this.isFocused);
      if (isToToggle) {
        this.isFocused = !this.isFocused;
        this.$titlePreview.toggle();
        this.$moreInfo.toggle();
        if (this.isFocused) {
          this.focuseMap();
        }
      }
    },

    // Remove the item, destroy the model and delete its view.
    clear: function() {
      // Remove marker
      this.markerGM.setMap(null);
      // Remove from server
      this.model.destroy();
      //  Remove current view
      this.remove();
    }
  });
});
