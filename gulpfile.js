/**************/
/*  REQUIRES  */
/**************/
var gulp = require("gulp");

// File IO
var sass = require("gulp-sass");
var react = require("gulp-react");
var concat = require("gulp-concat");
var jshint = require("gulp-jshint");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");


/****************/
/*  FILE PATHS  */
/****************/
var paths = {
  html: {
    src: {
      dir: "src/",
      files: ["src/*.html"]
    },
    dest: {
      dir: "dist/"
    }
  },

  scripts: {
    src: {
      dir: "src/jsx/",
      files: ["src/jsx/*.jsx"]
    },
    dest: {
      dir: "dist/js/",
      files: {
        unminified: "bundle.js",
        minified: "bundle.min.js"
      }
    }
  },

  styles: {
    src: {
      dir: "src/sass/",
      files: ["src/sass/*.scss"]
    },
    dest: {
      dir: "dist/css/"
    }
  },

  images: {
    src: {
      dir: "src/images/",
      files: ["src/images/*.ico", "src/images/*.png"]
    },
    dest: {
      dir: "dist/images/"
    }
  },

  fonts: {
    src: {
      dir: "src/fonts/",
      files: ["src/fonts/*.woff"]
    },
    dest: {
      dir: "dist/fonts/"
    }
  }
};


/***********/
/*  TASKS  */
/***********/
/* Copies HTML files to the distribution directory */
gulp.task("html", function () {
  return gulp.src(paths.html.src.files)
    // Write to the distribution directory
    .pipe(gulp.dest(paths.html.dest.dir));
});

/* Compiles, lints, minifies, and concatenates the script files */
gulp.task("scripts", function() {
  return gulp.src(paths.scripts.src.files)
    // Compile JSX into JS
    .pipe(react({
      harmony: true
    }))

    // Lint
    .pipe(jshint())
    .pipe(jshint.reporter("jshint-stylish"))

    // Concatenate files
    .pipe(concat(paths.scripts.dest.files.unminified))

    // Write un-minified version to the distribution directory
    .pipe(gulp.dest(paths.scripts.dest.dir))

    // Minify
    .pipe(uglify())

    // Rename the minified version
    .pipe(rename({
      extname: ".min.js"
    }))

    // Write minified version to the distribution directory
    .pipe(gulp.dest(paths.scripts.dest.dir));
});


/* Compiles SCSS files into CSS files */
gulp.task("styles", function () {
  return gulp.src(paths.styles.src.files)
    // Compile SCSS into CSS
    .pipe(sass({
      "outputStyle" : "compressed",
      "errLogToConsole": true
    }))

    // Change file extension
    .pipe(rename({
      extname: ".css"
    }))

    // Write to the distribution directory
    .pipe(gulp.dest(paths.styles.dest.dir));
});


/* Copies images to the distribution directory */
gulp.task("images", function () {
  return gulp.src(paths.images.src.files)
    // Write to the distribution directory
    .pipe(gulp.dest(paths.images.dest.dir));
});


/* Copies fonts to the distribution directory */
gulp.task("fonts", function () {
  return gulp.src(paths.fonts.src.files)
    // Write to the distribution directory
    .pipe(gulp.dest(paths.fonts.dest.dir));
});


/* Runs tasks when certain files change */
gulp.task("watch", function() {
  gulp.watch(paths.html.src.files, ["html"]);
  gulp.watch(paths.scripts.src.files, ["scripts"]);
  gulp.watch(paths.styles.src.files, ["styles"]);
  gulp.watch(paths.images.src.files, ["images"]);
  gulp.watch(paths.fonts.src.files, ["fonts"]);
});


/* Builds the distribution directory */
gulp.task("build", ["html", "scripts", "styles", "images", "fonts"]);


/* Builds and tests the files by default */
gulp.task("default", ["build"]);
