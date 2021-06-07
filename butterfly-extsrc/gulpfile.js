const gulp = require('gulp')
const rename = require('gulp-rename')
const terser = require('gulp-terser')
const inject = require('gulp-inject-string')

// gulp.task('inject:prepend', function () {
//   gulp.src('src/example.html')
//     .pipe(inject.prepend('<!-- Created: ' + Date() + ' -->\n'))
//     .pipe(rename('prepend.html'))
//     .pipe(gulp.dest('build'))
// })

// minify js
gulp.task('compress', () =>
  gulp.src('./src/**/*.js')
    .pipe(terser())
    // .pipe(inject.prepend('// Created: ' + new Date().toLocaleDateString('en-US') + ' \n'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./dist'))
)

// 執行 gulp 命令時執行的任務
gulp.task('default', gulp.parallel(
  'compress'
))
