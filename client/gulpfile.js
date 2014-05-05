var gulp = require('gulp');
var path = require('path');
var less = require('gulp-less');
var handlebars = require('gulp-handlebars');
var defineModule = require('gulp-define-module');

// Compile less files
gulp.task('less', function () {
  gulp.src('./assets/stylesheets/less/main.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'assest/stylesheets', 'less') ]
    }))
    .pipe(gulp.dest('./assets/stylesheets'));
});

gulp.task('templates', function(){
  gulp.src(['app/templates/*.handlebars'])
    .pipe(handlebars())
    .pipe(defineModule('amd'))
    .pipe(gulp.dest('app/templates/precompiled/templates'));
});

// Default task to run without params
gulp.task('default', ['less', 'templates'], function() {
  // Watch less files and compile
  gulp.watch('./assets/stylesheets/less/**/*.less', ['less']);

  // Watch handlebars templates files
  gulp.watch('./app/templates/**/*.handlebars', ['templates']);
});
