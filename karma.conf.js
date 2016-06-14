var webpackCfg = require('./webpack.config');

module.exports = function(config) {
  config.set({
    basePath: '',
    browsers: [ 'Chrome' ],
    files: [
      'test/loadtests.js'
    ],
    port: 8040,
    captureTimeout: 60000,
    frameworks: [ 'mocha', 'chai' ],
    client: {
      mocha: {}
    },
    singleRun: true,
    reporters: [ 'mocha', 'coverage' ],
    preprocessors: {
      'test/loadtests.js': [ 'webpack', 'sourcemap' ]
    },
    webpack: webpackCfg,
    webpackServer: {
      noInfo: true
    },

  });
};
