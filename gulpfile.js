var gulp = require('gulp');
var mocha = require('gulp-mocha');
var watch = require('gulp-watch');
var babel = require('gulp-babel');

gulp.task('default', [
  'build', 'buildandtest',
]);

gulp.task('test', function() {
  return gulp.src('tests/**/*.js', {read: false, })
    .pipe(mocha({reporter: 'nyan', }));
});

gulp.task('build', function(cb) {
  return gulp.src('src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('lib'))
    .on('end', function() {
      gulp.start('test');
    });
});

gulp.task('buildandtest', function() {
  gulp.watch([
    'src/**/*.js', 'tests/**/*.js',
  ], ['build']);
});
