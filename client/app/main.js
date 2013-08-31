define(function(require) {
  var Backbone = require('backbone');
  var $ = require('jquery');
  var app = require('app');
  var Router = require('routers/Router');
  var LoconotModel = require('models/loconot');
  var LoconotsCol =  require('collections/loconots');
  var AppView = require('views/app');

  // initialization function
  function init() {
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
  }

  $(document).ready(function () {
      test = init();
    });
});