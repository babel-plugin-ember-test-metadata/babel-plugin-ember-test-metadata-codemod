'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    emberHighCharts: {
      includeHighCharts: true,
      includeHighStock: false,
      includeHighChartsMore: true,
      includeHighCharts3D: true,
      includeModules: ['solid-gauge'],
    },

    babel: {
      plugins: [
        ...codeCoverage.buildBabelPlugin(),
        [require.resolve('babel-plugin-ember-test-metadata'), {
          enabled: !!process.env.BABEL_TEST_METADATA,
          packageName: defaults.project.pkg.name,
          isUsingEmbroider: !!process.env.EMBROIDER,
          projectRoot: '../..',
        }],
      ],
    },
  });

  // additional configuration

  return app.toTree();
};
