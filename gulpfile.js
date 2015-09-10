'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var gulpMocha = require('gulp-mocha');

gulp.task('jshint', function() {
  // do NOT jshint the code in imported modules.
  // if you want to test module code, send a pull request to the module dev
  // with tests you have helpfully coded for their benefit :-)

  // the ** glob specifies all subdirectories
  return gulp.src(['index.js', 'test/**/*.js', 'lib/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
 });

gulp.task('test', function() {
  return gulp.src('test/**/*_test.js')
    .pipe(gulpMocha());
});

gulp.task('default', ['jshint', 'test']);
