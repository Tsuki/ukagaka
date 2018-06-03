const gulp = require('gulp'),
  // webserver = require('gulp-webserver'),
  connect = require("gulp-connect"),
  streamify = require('gulp-streamify'),
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer'),
  babelify = require('babelify'),
  browserify = require('browserify'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  open = require('gulp-open'),
  sourcemaps = require('gulp-sourcemaps');

gulp.task('es6', function () {
  browserify({
    entries: './src/app.js',
    debug: true,
  }).transform(babelify.configure({
    presets: ["env"]
  })).bundle()
    .pipe(source('bundle.js'))
    // .pipe(streamify(uglify()))
    .pipe(gulp.dest('./build/'));
});

gulp.task('watch', function () {
  gulp.watch('./web/src/**/*.js', ['es6']);
});

gulp.task('connect', function () {
  connect.server({
    root: './',
    livereload: true,
    port: 4000
  });
});

gulp.task('open', function () {
  gulp.src(__filename)
    .pipe(open({uri: 'http://localhost:4000'}));
});

gulp.task('build', function () {
  browserify({
    entries: './src/app.js',
    debug: false
  }).transform(babelify.configure({
    presets: ["env"],
    sourceMaps: true
  })).bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(rename('bundle.min.js'))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./build/'));
});
// gulp.task('browserify', function () {
//   const bundleStream = browserify('./web/src/index.js').transform(babelify, {presets: ["env"]}).bundle();
//   bundleStream
//     .pipe(source('./web/ndex.js'))
//     .pipe(streamify(uglify()))
//     .pipe(rename('bundle.js'))
//     .pipe(gulp.dest('./dist'))
// });


gulp.task('default', ['connect', 'es6', 'watch', 'open']);
