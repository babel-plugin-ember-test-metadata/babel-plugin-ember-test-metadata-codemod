'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    'ember-cli-pemberly-i18n': i18nConfig,
    emberHighCharts: {
      includeHighCharts: true,
      includeHighStock: false,
      includeHighChartsMore: true,
      includeHighCharts3D: true,
      includeModules: ['solid-gauge'],
    },

    babel: {
      'ember-cli-pemberly-i18n': i18nConfig,

      plugins: [require.resolve('babel-plugin-ember-test-metadata'), {
        enabled: !!process.env.BABEL_TEST_METADATA,
        packageName: defaults.project.pkg.name,
        isUsingEmbroider: !!process.env.EMBROIDER,
      }],
    },
  });

  // additional configuration

  return app.toTree();
};
