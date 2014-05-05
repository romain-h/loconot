var gulp = require('gulp');
var path = require('path');
var less = require('gulp-less');

// Compile less files
gulp.task('less', function () {
  gulp.src('./assets/stylesheets/less/main.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'assest/stylesheets', 'less') ]
    }))
    .pipe(gulp.dest('./assets/stylesheets'));
});

// Default task to run without params
gulp.task('default', function() {
  // Watch less files and compile
  gulp.watch('./assets/stylesheets/less/**/*.less', ['less']);
});
