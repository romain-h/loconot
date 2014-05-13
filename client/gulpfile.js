var gulp = require('gulp');
var path = require('path');
var less = require('gulp-less');
var handlebars = require('gulp-handlebars');
var defineModule = require('gulp-define-module');
var requirejs = require('requirejs');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

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

gulp.task('build', ['less', 'templates'], function() {
  requirejs.optimize({
    dir: 'build',
    baseUrl: 'app/',
    removeCombined: true,
    mainConfigFile: './app/config.js',
    modules: [{ "name": "config" }],
    optimize: 'none'
    });

    // Concat result in one file
     gulp.src(['bower_components/requirejs/require.js','build/config.js'])
      .pipe(uglify())
      .pipe(concat('main.js'))
      .pipe(gulp.dest('./dist/'))

});
