/**************/
/*  REQUIRES  */
/**************/
var gulp = require("gulp");

// File IO
var sass = require("gulp-sass");
var concat = require("gulp-concat");
var jshint = require("gulp-jshint");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var minifyHTML = require("gulp-minify-html");
var streamqueue = require("streamqueue");

// Live-reload
var express = require("express");
var refresh = require("gulp-livereload");
var lrserver = require("tiny-lr")();
var livereload = require("connect-livereload");

/****************/
/*  FILE PATHS  */
/****************/
var paths = {
  distDir: "dist",

  html: {
    src: {
      dir: "src",
      files: [
        "src/index.html"
      ]
    },
    dist: {
      dir: "dist"
    }
  },

  scripts: {
    src: {
      dir: "src/js",
      files: [
        "src/js/*.js"
      ]
    },
    dist: {
      dir: "dist/js"
    }
  },

  styles: {
    src: {
      dir: "src/scss",
      files: [
        "src/scss/*.scss"
      ]
    },
    dist: {
      dir: "dist/css"
    }
  }
};

/***********/
/*  TASKS  */
/***********/
/* Minifies HTML files */
gulp.task("html", function() {
  gulp.src(paths.html.src.files)
    // Minify
    .pipe(minifyHTML())

    // Write minified version
    .pipe(gulp.dest(paths.html.dist.dir))
});

/* Lints, minifies, and concatenates script files */
gulp.task("scripts", function() {
  return gulp.src(paths.scripts.src.files)
    // Lint
    .pipe(jshint())
    .pipe(jshint.reporter("jshint-stylish"))

    // Write un-minified version
    .pipe(gulp.dest(paths.scripts.dist.dir))

    // Minify
    .pipe(uglify())

    // Rename file
    .pipe(rename(function(path) {
      path.extname = ".min.js"
    }))

    // Write minified version
    .pipe(gulp.dest(paths.scripts.dist.dir));
});

/* Converts scss files to css */
gulp.task("styles", function () {
  return gulp.src(paths.styles.src.files)
    // Convert file
    .pipe(sass({
      outputStyle : "compressed",
      errLogToConsole: true
    }))

    // Rename file
    .pipe(rename(function(path) {
      path.extname = ".css"
    }))

    // Write output file
    .pipe(gulp.dest(paths.styles.dist.dir));
});

/* Reloads the live-reload server */
gulp.task("reload", function(){
  gulp.src(paths.distDir + "/**/*")
    .pipe(refresh(lrserver));
});

/* Starts the live-reload server */
gulp.task("server", function() {
  // Set the ports
  var livereloadport = 35729;
  var serverport = 9999;

  // Configure the server and add live-reload middleware
  var server = express();
  server.use(livereload({
    port: livereloadport
  }));

  // Set up the static fileserver, which serves files in the dist dir
  server.use(express.static(__dirname));
  server.listen(serverport);

  // Set up the live-reload server
  lrserver.listen(livereloadport);
});

/* Re-runs the "scripts" task every time a script file changes */
gulp.task("watch", function() {
  gulp.watch([paths.html.src.dir + "/**/*"], ["html"]);
  gulp.watch([paths.scripts.src.dir + "/**/*"], ["scripts"]);
  gulp.watch([paths.styles.src.dir + "/**/*"], ["styles"]);
  gulp.watch([paths.distDir + "/**/*"], ["reload"]);
});

/* Starts the live-reload server and refreshes it everytime a dist file changes */
gulp.task("serve", ["html", "scripts", "styles", "server", "watch"]);

/* Runs the "test" and "scripts" tasks by default */
gulp.task("default", ["html", "scripts", "styles"]);
