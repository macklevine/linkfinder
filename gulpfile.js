'use strict';

var gulp = require('gulp');
var server = require('gulp-develop-server');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var concatCss = require('gulp-concat-css');
var pump = require('pump');
var less = require('gulp-less');
var fs = require('fs');

var mocha = require('gulp-mocha');

gulp.task('runTests', function(){
  gulp.src('test/*.js', {read: false})
    .pipe(mocha(
      {
        reporter: 'nyan'
      }
    ));
});

gulp.task('default', ['runTests', 'concatJavascript', 'getFonts', 'compileLess', 'scootTemplates', 'start-server', 'watch-for-changes']);
gulp.task('release', ['concatAndMinifyJavascript', 'getFonts', 'compileLess', 'scootTemplates']);

gulp.task( 'start-server', function() {
    server.listen({
    	path: './server/app.js',
      env: {
        NODE_ENV : 'development'
      }
    });
});

var javaScriptSources = [
  'bower_components/jquery/dist/jquery.js',
  'bower_components/angular/angular.js',
  'bower_components/angular-sanitize/angular-sanitize.js',
  'bower_components/angular-animate/angular-animate.js',
  'bower_components/checklist-model/checklist-model.js',
  'bower_components/angular-route/angular-route.js',
  'bower_components/bootstrap/dist/js/bootstrap.min.js',
  'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
  'bower_components/angular-data-table/release/dataTable.js',
  'bower_components/ng-csv/build/ng-csv.js',
  'bower_components/ngstorage/ngStorage.js',
  'client/lib/js/**/*.js'
];

gulp.task('concatJavascript', function() {
  return gulp.src(javaScriptSources)
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('./client/dist/js'));
});

gulp.task('concatAndMinifyJavascript', function(){
  return gulp.src(javaScriptSources)
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('./client/dist/js'))
    .pipe(uglify())
    .pipe(gulp.dest('./client/dist/js'));
});

gulp.task('compileLess', function () {
  return gulp.src([
  		'./bower_components/bootstrap/dist/css/bootstrap.css',
      './bower_components/angular-data-table/release/dataTable.css',
      './bower_components/angular-data-table/release/material.css',
      './bower_components/font-awesome/css/font-awesome.css',
      './client/less/*.less',
      './client/less/*.css'
	])
  .pipe(less())
  .pipe(concatCss("styles.css", {
    rebaseUrls : false
  }))
  .pipe(gulp.dest('./client/dist/css'));
});
gulp.task('getFonts', function () {
  return gulp.src([
      './bower_components/font-awesome/fonts/*'
    ])
  .pipe(gulp.dest('./client/dist/fonts'));
});

gulp.task('scootTemplates', function () {
	return gulp.src([
		'./client/lib/html/*.html'
	])
	.pipe(gulp.dest('./client/dist/html'));
});

gulp.task('watch-for-changes', function(){
  gulp.watch('./server/**/*.js', [server.restart]);
  gulp.watch(['./client/lib/js/**/*.js', './bower_components/**/*.*'], ['concatJavascript']);
  gulp.watch('./client/less/*', ['compileLess']);
  gulp.watch(['./client/lib/html/**/*.html', './client/index.html'], ['scootTemplates']);
});

