var gulp = require('gulp');
var mocha = require('gulp-mocha');
var watch = require('gulp-watch');
var babel = require('gulp-babel');

gulp.task('test-watch', function() {
  gulp.start('test');
  watch('**/*.js', function() {
    gulp.start('test');
  });
});

gulp.task('test', function() {
  return gulp.src('test.js', {read: false, })
    .pipe(mocha({reporter: 'nyan', }));
});

gulp.task('build', function() {
  return gulp.src('src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('lib'));
});

gulp.task('watch', function() {
  gulp.watch('src/**/*.js', [
    'build',
  ]);
});

