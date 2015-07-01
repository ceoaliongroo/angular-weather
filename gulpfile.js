var gulp = require('gulp');
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');

gulp.task('default', function() {
  return gulp.src('*.js')
    .pipe(clean())
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});