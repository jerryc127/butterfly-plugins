const basePaths = {
  src: 'src/',
  dest: 'dist/',
  bower: 'bower_components/'
};
const paths = {
  scripts: {
    src: basePaths.src + 'js/',
    dest: basePaths.dest + 'js/'
  },
  styles: {
    src: basePaths.src + 'css/',
    dest: basePaths.dest + 'css/'
  },
  fonts: {
    src: basePaths.src + 'fonts/',
    dest: basePaths.dest + 'fonts/'
  }
};

const appFiles = {
  styles: [paths.styles.src + '**/*.scss'],
  jqueryShare: [],
  socialShare: [paths.scripts.src + 'qrcode.js', paths.scripts.src + 'social-share.js'],
  fonts: [paths.fonts.src + '**/*.{woff,woff2,ttf,eot,svg}']
};

const vendorFiles = {
  styles: [],
  scripts: [],
  fonts: []
};

/*
  Let the magic begin
*/

const gulp = require('gulp');
const es = require('event-stream');
const gutil = require('gulp-util');
const concat = require('gulp-concat');
const del = require('del');

const plugins = require("gulp-load-plugins")({
  pattern: ['gulp-*', 'gulp.*'],
  replaceString: /\bgulp[\-.]/
});

// Add sass compiler
const sassCompiler = require('sass');
plugins.sass = require('gulp-sass')(sassCompiler);

// Allows gulp --dev to be run for a more verbose output
const isProduction = true;
let sassStyle = 'compressed';
let sourceMap = false;

if(gutil.env.dev === true) {
  sassStyle = 'expanded';
  sourceMap = true;
  // isProduction = false; // This line was commented out in original
}

const changeEvent = function(evt) {
  gutil.log('File', gutil.colors.cyan(evt.path.replace(new RegExp('/.*(?=/' + basePaths.src + ')/'), '')), 'was', gutil.colors.magenta(evt.type));
};

const clean = function(path, cb) {
  // You can use multiple globbing patterns as you would with `gulp.src`
  del([path], {force:true}, cb);
};

gulp.task('css', function(cb){
  // app css
  gulp.src(vendorFiles.styles.concat(appFiles.styles))
    .pipe(require('gulp-sass')(require('sass'))({
      outputStyle: sassStyle, sourcemap: sourceMap, precision: 2
    }))
    // .pipe(plugins.concat('style.min.css'))
    .pipe(require('gulp-rename')({ suffix: '.min' }))
    .pipe(gulp.dest(paths.styles.dest));
    cb()
});

gulp.task('share.js', function () {
  return gulp.src(appFiles.socialShare)
    .pipe(require('gulp-concat')('social-share.js'))
    .pipe(isProduction ? require('gulp-uglify')() : gutil.noop())
    .pipe(require('gulp-rename')({ suffix: '.min' }))
    .pipe(gulp.dest(paths.scripts.dest));
});

gulp.task('fonts', function(){
  return gulp.src(appFiles.fonts, {encoding: false})
    .pipe(gulp.dest(paths.fonts.dest));
});


gulp.task('watch', gulp.series(gulp.parallel('css', 'share.js', 'fonts'), function (done) {
  gulp.watch(appFiles.styles, gulp.series('css')).on('change', function (evt) {
    changeEvent(evt);
  });

  gulp.watch(paths.scripts.src + '*.js', gulp.series('share.js')).on('change', function (evt) {
    changeEvent(evt);
  });
  done();
}));

gulp.task('default', gulp.parallel('css', 'share.js', 'fonts'));
