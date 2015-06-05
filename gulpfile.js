var gulp = require('gulp');
var mocha = require('gulp-mocha');
var watch = require('gulp-watch');

gulp.task('test-watch', function() {
    gulp.start('test');
    watch('**/*.js', function () {
        gulp.start('test');
    });
});
gulp.task('test', function() {
        return gulp.src('test.js', {read: false})
        .pipe(mocha({reporter: 'nyan'}));
});

