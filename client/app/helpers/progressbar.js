define(function(require) {

  // Custom wrapper fo NProgress to handle concurrent loader on the singleton
  var nprogress = require('nprogress');

  var customPb = {};
  customPb.count = 0;

  customPb.start = function() {
    this.count++;
    if (this.count == 1) {
      nprogress.start();
    }
  };

  customPb.done = function() {
    this.count--;
    if (this.count == 0) {
      nprogress.done();
    }
  };

  return customPb;

});
