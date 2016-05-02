var
  gulp = require('gulp'),
  Server = require('karma').Server,
  shell = require('gulp-shell')
;

gulp.task('test', function(done){
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: false
  }, done).start();
});

gulp.task('build');
