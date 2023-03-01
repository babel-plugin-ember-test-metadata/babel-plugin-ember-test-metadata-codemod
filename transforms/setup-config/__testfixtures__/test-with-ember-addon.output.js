'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function (defaults) {
  const i18nConfig = {
    defaultLocale: 'en_US',
    buildLocales: ['en_US', 'ar_AE'],
  };

  let app = new EmberAddon(defaults, {
    'ember-cli-pemberly-i18n': i18nConfig,

    l10nLint: {
      enabled: false,
    },

    cssModules: {
      intermediateOutputPath: 'app/styles/_css-modules.css',
    },

    'ember-holy-futuristic-template-namespacing-batman': {
      excludeNestedAddonTransforms: !!process.env.EMBROIDER_TEST_SETUP_OPTIONS
    },

    babel: {
      plugins: [[require.resolve('babel-plugin-ember-test-metadata'), {
        enabled: !!process.env.BABEL_TEST_METADATA,
        packageName: defaults.project.pkg.name,
        isUsingEmbroider: !!process.env.EMBROIDER,
      }]],
    },
  });

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  const { maybeEmbroider } = require('@embroider/test-setup');
  return maybeEmbroider(app);
};
