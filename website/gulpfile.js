'use strict';

/* REQUIRES */
var gulp = require('gulp');

// Helper libraries
var _ = require('lodash');
var del = require('del');
var gutil = require('gulp-util');
var runSequence = require('run-sequence');

// Linting
var eslint = require('gulp-eslint');

// Browser sync
var browserSync = require('browser-sync').create();

// File I/O
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var replace = require('gulp-replace');
var htmlreplace = require('gulp-html-replace');

// Browserify
var source = require('vinyl-source-stream');
var babelify = require('babelify');
var watchify = require('watchify');
var streamify = require('gulp-streamify');
var browserify = require('browserify');


/* FILE PATHS */
var paths = {
  html: {
    files: ['index.html'],
    srcDir: '.',
    destDir: 'dist'
  },

  js: {
    files: ['js/**/*.js'],
    srcDir: 'js',
    destDir: 'dist/js'
  },

  css: {
    files: ['scss/**/*.scss'],
    srcDir: 'scss',
    destDir: 'dist/css'
  },

  images: {
    files: ['images/**/*'],
    srcDir: 'images',
    destDir: 'dist/images'
  },

  fonts: {
    files: ['fonts/**/*'],
    srcDir: 'fonts',
    destDir: 'dist/fonts'
  },

  bower: {
    files: ['bower_components/**/*'],
    srcDir: 'bower_components',
    destDir: 'dist/bower_components'
  }
};


/* TASKS */
/* Compiles SCSS files into CSS files and copies them to the distribution directory */
gulp.task('css', function() {
  return gulp.src(paths.css.files)
    .pipe(sass({
      'outputStyle': 'compressed',
      'errLogToConsole': true
    }))
    .pipe(gulp.dest(paths.css.destDir));
});


/* Copies files to the distribution directory */
['bower', 'images', 'fonts'].forEach(function(fileType) {
  gulp.task(fileType, function() {
    return gulp.src(paths[fileType].files)
      .pipe(gulp.dest(paths[fileType].destDir));
  });
});


/* Deletes the distribution directory */
gulp.task('clean', function() {
  return del('dist');
});


/* Copies the HTML file to the distribution directory */
gulp.task('html', function() {
  return gulp.src(paths.html.files)
    .pipe(htmlreplace({
      'js': '/js/build.js'
    }))
    .pipe(gulp.dest(paths.html.destDir));
});


/* Lints the JS files */
gulp.task('lint', function() {
  var filesToLint = _.union(paths.js.files, ['gulpfile.js', 'server/rewriteToIndex.js']);
  return gulp.src(filesToLint)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});


/* Helper which bundles the JS files and copies the bundle into the distribution file (dev) */
function bundle(b) {
  return b
    .bundle()
    .on('error', function(error) {
      gutil.log(gutil.colors.red('Error bundling distribution files:'), error.message);
    })
    .pipe(source('build.js'))
    .pipe(gulp.dest(paths.js.destDir));
}


/* Browserifies the JS files and copies the bundle into the distribution file (dev) */
gulp.task('js:dev', ['lint'], function() {
  var b = browserify({
    entries: 'js/components/App.js',
    plugin: [watchify],
    transform: [
      babelify.configure({
        presets: ['es2015', 'react']
      })
    ],
    cache: {},
    debug: true,
    fullPaths: true,
    packageCache: {}
  });

  // Re-bundle the distribution file every time a source JS file changes
  b.on('update', function() {
    gutil.log('Re-bundling distribution files');
    runSequence('lint', function() {
      bundle(b);
    });
  });

  // Log a message and reload the browser once the bundling is complete
  b.on('log', function(message) {
    gutil.log('Distribution files re-bundled:', message);
    runSequence('reload');
  });

  return bundle(b);
});


/* Browserifies the JS files and copies the bundle into the distribution file (prod) */
gulp.task('js:prod', function(done) {
  runSequence('lint', 'browserify', function(error) {
    done(error && error.err);
  });
});


/* Browserifies the JS files into a single bundle file */
gulp.task('browserify', function() {
  return browserify({
    entries: 'js/components/App.js',
    transform: [
      babelify.configure({
        presets: ['es2015', 'react']
      })
    ]
  })
    .bundle()
    .on('error', function(error) {
      gutil.log(gutil.colors.red('Error bundling distribution files:'), error.message);
      process.exit(1);
    })
    .pipe(source('build.min.js'))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest(paths.js.destDir));
});


/* Watches for file changes (JS file changes are watched elsewhere via watchify) */
gulp.task('watch', function() {
  _.forEach(['css', 'html', 'bower', 'fonts', 'images'], function(fileType) {
    gulp.watch(paths[fileType].files, function() {
      runSequence(fileType, 'reload');
    });
  });
});


/* Reloads the browser */
gulp.task('reload', function() {
  browserSync.reload();
});


/* Static server which rewrites all non static file requests back to index.html */
gulp.task('serve', function() {
  browserSync.init({
    port: 1988,
    open: false,
    server: {
      baseDir: 'dist/',
      middleware: [
        // Middleware which redirects unknown paths to index.html so that router can handle them
        require('./server/rewriteToIndex.js')
      ]
    }
  });
});


/* Builds the distribution directory */
gulp.task('build:dev', ['js:dev', 'html', 'css', 'bower', 'images', 'fonts']);
gulp.task('build:prod', ['js:prod', 'html', 'css', 'bower', 'images', 'fonts']);


/* Production deployment task */
gulp.task('prod', function(done) {
  runSequence('clean', 'build:prod', function(error) {
    done(error && error.err);
  });
});


/* Default task for local development */
gulp.task('default', function(done) {
  runSequence('clean', 'build:dev', 'watch', 'serve', function(error) {
    done(error && error.err);
  });
});
