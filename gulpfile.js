'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var browserSync = require('browser-sync');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var gutil = require('gulp-util');
var cssnano = require('gulp-cssnano');
var autoprefixer = require('gulp-autoprefixer');
var critical = require('critical').stream;
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');

// Development Tasks 
// -----------------

// Start browserSync server
gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'src'
    }
  })
})

gulp.task('sass', function() {
  return gulp.src('src/scss/**/*.scss') // Gets all files ending with .scss in app/scss and children dirs
    .pipe(sass().on('error', sass.logError)) // Passes it through a gulp-sass, log errors to console
    .pipe(cssnano())
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(gulp.dest('build/css')) // Outputs it in the css folder
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.reload({ // Reloading with Browser Sync
      stream: true
    }));
})

// Watchers
gulp.task('watch', function() {
  gulp.watch('src/scss/**/*.scss', ['sass']);
  gulp.watch('src/*.html', browserSync.reload);
  gulp.watch('src/js/**/*.js', browserSync.reload);
})

// Optimization Tasks 
// ------------------

// Optimizing CSS and JavaScript 
gulp.task('useref', function() {
  return gulp.src('src/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', babel())) // notice the error event here))
    // .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('build'));
});

gulp.task('scripts', function() {
  return gulp.src('build/js/main.min.js')
    .pipe(uglify())
    .pipe(gulp.dest('build/js/'));
});


// Optimizing Images 
gulp.task('images', function() {
  return gulp.src('src/images/**/*.+(png|jpg|jpeg|gif|svg)')
    // Caching images that ran through imagemin
    .pipe(cache(imagemin({
      interlaced: true,
    })))
    .pipe(gulp.dest('build/images'))
});

// Copying fonts 
gulp.task('fonts', function() {
  return gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('build/fonts'))
})

// Copying video
gulp.task('video', function() {
  return gulp.src('src/video/**/*')
    .pipe(gulp.dest('build/video'))
})

// Cleaning 
gulp.task('clean', function() {
  return del.sync('build').then(function(cb) {
    return cache.clearAll(cb);
  });
})

gulp.task('clean:build', function() {
  return del.sync(['build/**/*', '!build/images', '!build/images/**/*']);
});

// Generate & Inline Critical-path CSS
gulp.task('critical', function () {
    return gulp.src('build/*.html')
        .pipe(critical({base: 'build/', inline: true, minify: true, css: 'build/css/styles.css', ignore: ['@import']}))
        .on('error', function(err) { gutil.log(gutil.colors.red(err.message)); })
        .pipe(gulp.dest('build'));
});

// Build Sequences
// ---------------

gulp.task('default', function(callback) {
  runSequence(['sass', 'browserSync'], 'watch',
    callback
  )
})

gulp.task('build', function(callback) {
  runSequence(
    'clean:build',
    ['sass', 'useref', 'images', 'fonts', 'video'],
    'critical',
    'scripts',
    callback
  )
})