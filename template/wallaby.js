const wallabyWebpack = require('wallaby-webpack'){{#if_eq eslintConfig "airbnb"}};{{/if_eq}}
var webpackConfig = require('./build/webpack.test.conf'){{#if_eq eslintConfig "airbnb"}};{{/if_eq}}

module.exports = function (wallaby) {
  webpackConfig.resolve.alias = {'@': require('path').join(wallaby.projectCacheDir, 'src')}{{#if_eq eslintConfig "airbnb"}};{{/if_eq}}
  webpackConfig.module.rules.find(r => r.loader === 'vue-loader').options.loaders.jss = ''{{#if_eq eslintConfig "airbnb"}};{{/if_eq}}
  const wallabyPostprocessor = wallabyWebpack(webpackConfig){{#if_eq eslintConfig "airbnb"}};{{/if_eq}}

  return {
    files: [
      {{#if_eq runner "karma"}}
      {pattern: 'node_modules/chai/chai.js', instrument: false},
      {pattern: 'node_modules/sinon/lib/sinon.js', instrument: false},
      {{/if_eq}}
      {{#if_eq runner "jest"}}
      'package.json',
      {{#if_eq compiler "typescript"}}
      'tsconfig.json',
      {{/if_eq}}
      {{/if_eq}}
      {pattern: 'src/**/*.*', load: false},
    ],

    compilers: {
      '**/*.vue': require('wallaby-vue-compiler'),
      '**/*.js': wallaby.compilers.babel()
    },

    tests: [
      {{#if_eq compiler "typescript"}}
      {pattern: 'test/unit/specs/**/*.spec.ts', load: false},
      {pattern: 'test/unit/specs/*.spec.ts', load: false},
      {{/if_eq}}{{#if_eq compiler "es2015"}}
      {pattern: 'test/unit/specs/**/*.spec.js', load: false},
      {pattern: 'test/unit/specs/*.spec.js', load: false},
      {{/if_eq}}
    ],

    postprocessor: wallabyPostprocessor,
    {{#if_eq runner "karma"}}
    testFramework: 'mocha',
    {{/if_eq}}
    {{#if_eq runner "jest"}}
    testFramework: 'jest',
    env: {
      type: 'node',
      runner: 'node'
    },
    {{/if_eq}}
    {{#if_eq runner "karma"}}
    setup: function () {
      window.__moduleBundler.loadTests(){{#if_eq eslintConfig "airbnb"}};{{/if_eq}}
      window.expect = chai.expect{{#if_eq eslintConfig "airbnb"}};{{/if_eq}}
      window.sinon = sinon{{#if_eq eslintConfig "airbnb"}};{{/if_eq}}
      var should = chai.should(){{#if_eq eslintConfig "airbnb"}};{{/if_eq}}
    }
    {{/if_eq}}
    {{#if_eq runner "jest"}}
    setup: function (wallaby) {
      var jestConfig = require('./package.json').jest;
      jestConfig.globals = { "__DEV__": true };
      wallaby.testFramework.configure(jestConfig);
    }
    {{/if_eq}}
  }
}