const gulp = require('gulp')
const rename = require('gulp-rename')
const terser = require('gulp-terser');

// minify js 
gulp.task('compress', () =>
  gulp.src('./src/**/*.js')
    .pipe(terser())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./dist'))
)


// 執行 gulp 命令時執行的任務
gulp.task('default', gulp.parallel(
  'compress'
))
