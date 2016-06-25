// Helper libraries
const _ = require('lodash');
const del = require('del');
const gulp = require('gulp');
const gutil = require('gulp-util');
const runSequence = require('run-sequence');

// Linting
const eslint = require('gulp-eslint');

// Browser sync
const browserSync = require('browser-sync').create();

// File I/O
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const htmlreplace = require('gulp-html-replace');

// Browserify
const source = require('vinyl-source-stream');
const babelify = require('babelify');
const watchify = require('watchify');
const streamify = require('gulp-streamify');
const browserify = require('browserify');


/* FILE PATHS */
const paths = {
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
gulp.task('css', () => {
  return gulp.src(paths.css.files)
    .pipe(sass({
      'outputStyle': 'compressed',
      'errLogToConsole': true
    }))
    .pipe(gulp.dest(paths.css.destDir));
});


/* Copies files to the distribution directory */
['bower', 'images', 'fonts'].forEach((fileType) => {
  gulp.task(fileType, () => {
    return gulp.src(paths[fileType].files)
      .pipe(gulp.dest(paths[fileType].destDir));
  });
});


/* Deletes the distribution directory */
gulp.task('clean', () => {
  return del('dist');
});


/* Copies the HTML file to the distribution directory (dev) */
gulp.task('html:dev', () => {
  return gulp.src(paths.html.files)
    .pipe(htmlreplace({
      'js': '/js/build.js'
    }))
    .pipe(gulp.dest(paths.html.destDir));
});

/* Copies the HTML file to the distribution directory (prod) */
gulp.task('html:prod', () => {
  return gulp.src(paths.html.files)
    .pipe(htmlreplace({
      'js': '/js/build.min.js'
    }))
    .pipe(gulp.dest(paths.html.destDir));
});


/* Lints the JS files */
gulp.task('lint', () => {
  return gulp.src(paths.js.files)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});


/* Helper which bundles the JS files and copies the bundle into the distribution file (dev) */
const bundle = (b) => {
  return b
    .bundle()
    .on('error', (error) => {
      gutil.log(gutil.colors.red('Error bundling distribution files:'), error.message);
    })
    .pipe(source('build.js'))
    .pipe(gulp.dest(paths.js.destDir));
};


/* Browserifies the JS files and copies the bundle into the distribution file (dev) */
gulp.task('js:dev', ['lint'], () => {
  const b = browserify({
    entries: 'js/containers/AppContainer.js',
    plugin: [watchify],
    transform: [
      babelify.configure({
        plugins: ['lodash'],
        presets: ['es2015', 'react']
      })
    ],
    cache: {},
    debug: true,
    fullPaths: true,
    packageCache: {}
  });

  // Re-bundle the distribution file every time a source JS file changes
  b.on('update', () => {
    gutil.log('Re-bundling distribution files');
    runSequence('lint', () => {
      bundle(b);
    });
  });

  // Log a message and reload the browser once the bundling is complete
  b.on('log', (message) => {
    gutil.log('Distribution files re-bundled:', message);
    runSequence('reload');
  });

  return bundle(b);
});


/* Browserifies the JS files and copies the bundle into the distribution file (prod) */
gulp.task('js:prod', (done) => {
  process.env.NODE_ENV = 'production';
  runSequence('lint', 'browserify', (error) => {
    done(error && error.err);
  });
});


/* Browserifies the JS files into a single bundle file */
gulp.task('browserify', () => {
  return browserify({
    entries: 'js/containers/AppContainer.js',
    transform: [
      babelify.configure({
        plugins: ['lodash'],
        presets: ['es2015', 'react']
      })
    ]
  })
    .bundle()
    .on('error', (error) => {
      gutil.log(gutil.colors.red('Error bundling distribution files:'), error.message);
      process.exit(1);
    })
    .pipe(source('build.min.js'))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest(paths.js.destDir));
});


/* Watches for file changes (JS file changes are watched elsewhere via watchify) */
gulp.task('watch', () => {
  _.forEach(['css', 'html', 'bower', 'fonts', 'images'], (fileType) => {
    gulp.watch(paths[fileType].files, () => {
      runSequence(fileType, 'reload');
    });
  });
});


/* Reloads the browser */
gulp.task('reload', () => {
  browserSync.reload();
});


/* Static server which rewrites all non static file requests back to index.html */
gulp.task('serve', () => {
  browserSync.init({
    port: 1988,
    open: false,
    notify: false,
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
gulp.task('build:dev', ['js:dev', 'html:dev', 'css', 'bower', 'images', 'fonts']);
gulp.task('build:prod', ['js:prod', 'html:prod', 'css', 'bower', 'images', 'fonts']);


/* Production deployment task */
gulp.task('prod', (done) => {
  runSequence('clean', 'build:prod', (error) => {
    done(error && error.err);
  });
});


/* Default task for local development */
gulp.task('default', (done) => {
  runSequence('clean', 'build:dev', 'watch', 'serve', (error) => {
    done(error && error.err);
  });
});
