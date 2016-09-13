'use strict';

var gulp = require('gulp');
var server = require('gulp-develop-server');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var concatCss = require('gulp-concat-css');
var pump = require('pump');
var less = require('gulp-less');
var fs = require('fs');

//set up the watchers only once.
gulp.task('default', ['concatAndCompress', 'compileLess', 'scootTemplates', 'start-server', 'watch-for-changes']);

gulp.task( 'start-server', function() {
    server.listen({
    	path: './server/app.js'
    });
});

gulp.task('concatAndCompress', function() {
  return gulp.src([
  		'bower_components/jquery/dist/jquery.js',
  		'bower_components/datatables.net/js/jquery.dataTables.js',
  		'bower_components/angular/angular.js',
      'bower_components/checklist-model/checklist-model.js',
  		'bower_components/angular-route/angular-route.js',
  		'bower_components/bootstrap/dist/js/bootstrap.min.js',
  		'bower_components/angular-bootstrap/ui-bootstrap.js',
      'bower_components/angular-data-table/release/dataTable.js',
  		'client/lib/js/*.js'
  	])
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('./client/dist/js'));
    // .pipe(uglify())
    // .pipe(gulp.dest('./client/dist/js'));
    // TODO: enable for production.
});


gulp.task('compileLess', function () {
  return gulp.src([
  		'./bower_components/bootstrap/dist/css/bootstrap.css',
      './bower_components/angular-data-table/release/dataTable.css',
      './bower_components/angular-data-table/release/material.css',
  		'./client/less/*.less',
  		'./client/less/*.css'
	])
    .pipe(less())
    .pipe(concatCss("styles.css"))
    .pipe(gulp.dest('./client/dist/css'));
});

gulp.task('scootTemplates', function () {
	return gulp.src([
		'./client/lib/html/*.html'
	])
	.pipe(gulp.dest('./client/dist/html'));
});

gulp.task('watch-for-changes', function(){
	gulp.watch(['./client/lib/js/*.js','./client/lib/html/*.html','./src/*/*.js','./server/*.js'], ['concatAndCompress', 'restartServer']);
	gulp.watch('./client/less/*', ['compileLess', server.restart]);
	gulp.watch('./client/lib/html/*.html', ['scootTemplates']);
});


gulp.task('restartServer', server.restart);