define(function(require) {
  var Backbone = require('backbone');
  var $ = require('jquery');
  var app = require('app');
  var Handlebars = require('handlebars');
  require('templates');

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

    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.destroy);
      this.listenTo(this.model, 'visible', this.toggleVisible);
      this.position = new google.maps.LatLng(this.model.get('lat'), this.model.get('lng'));
    },

    // Re-renders the titles of the todo item.
    render: function() {
      this.$el.html( this.template( this.model.toJSON() ) );
      this.renderMapMarker();
      this.$titlePreview = this.$('#titlePreview');
      this.$moreInfo = this.$('#moreInfo');
      return this;
    },

    renderMapMarker: function(){
      // var positionGM = new google.maps.LatLng(this.model.get('lat'), this.model.get('lng'));
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
        console.log('ADD EVENT');
        console.log(mark);
        win.open(app.gmap.map, mark);
      });
    },

    focuseMap: function(){
      app.gmap.map.setCenter(this.position);
    },

    moreInfo: function(){
      console.log(this);
      this.$titlePreview.hide();
      this.$moreInfo.show();
      this.focuseMap();

    },
    // Determines if item should be hidden
    toggleVisible : function () {
      this.$el.toggleClass( 'hidden',  this.isHidden());
    },

    // Toggle the `"completed"` state of the model.
    togglecompleted: function() {
      this.model.toggle();
    },

    isHidden : function () {
      var isCompleted = this.model.get('completed');
      return ( // hidden cases only
        (!isCompleted && app.TodoFilter === 'completed')
        || (isCompleted && app.TodoFilter === 'active')
      );
    },

    // View modal add new
    addNew: function(){
      console.log("Add a new loconot");
    },
    // Switch this view into `"editing"` mode, displaying the input field.
    edit: function() {
      this.$el.addClass('editing');
      this.$input.focus();
    },

    // Close the `"editing"` mode, saving changes to the todo.
    close: function() {
      var value = this.$input.val().trim();

      if ( value ) {
        this.model.save({ title: value });
      }

      this.$el.removeClass('editing');
    },

    // If you hit `enter`, we're through editing the item.
    updateOnEnter: function( e ) {
      if ( e.which === app.keys.enter ) {
        this.close();
      }
    },

    // Remove the item, destroy the model and delete its view.
    clear: function() {
      console.log('Destroying model');
      // Remove from server
      this.model.destroy();
      //  Remove current view
      this.remove();
    }
  });
});