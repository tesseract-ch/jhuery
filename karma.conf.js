// Karma configuration
// Generated on Mon Dec 28 2015 17:00:13 GMT+0100 (CET)
var
  webpack = require('webpack'),
  path = require('path')
;


module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'tests/**/*Spec.js'//,
      //'src/**/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'tests/**': [ 'webpack' ],
      'src/**/*.js': [ 'webpack', 'coverage' ]
    },
    webpack: {
      resolve: {
        extensions: [ "", ".js" ]
      },
      module: {
        preLoaders: [
          {
            test: /\.js$/,
            include: path.resolve('src/'),
            loader: 'istanbul-instrumenter'
          }
        ],
        loaders: [

        ]
      }
    },


    webpackMiddleware: {
      stats: {
        colors: true
      }
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha', 'coverage'],
    coverageReporter: {
      // type: 'text-summary'
      // type: 'lcov',      type : 'html',
      dir : 'coverage/',
      reporters: [
        { type: 'html', subdir: 'report-html' },
        { type: 'lcov', subdir: 'report-lcov' },
        {  type: 'text' }
      ]
    },


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome', 'Firefox' ],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  });
};
