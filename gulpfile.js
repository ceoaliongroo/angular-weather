var gulp = require('gulp');
var karma = require('karma').server;
var karmaConfig = require('./karma.conf');
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');

gulp.task('clean:dist', function () {
  return gulp.src('dist')
    .pipe(clean());
});

gulp.task('build', ['clean:dist'], function() {
  return gulp.src('src/**/*.js')
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('test', function () {

  karmaConfig({
    set: function (testConfig) {

      extend(testConfig, {
        singleRun: ciMode,
        autoWatch: !ciMode,
        browsers: ['PhantomJS']
      });

      karma.start(testConfig, function (exitCode) {
        plugins.util.log('Karma has exited with ' + exitCode);
        process.exit(exitCode);
      });
    }
  });
});

gulp.task('default', ['build']);