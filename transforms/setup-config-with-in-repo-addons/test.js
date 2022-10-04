'use strict';

const { runTransformTest } = require('codemod-cli');

runTransformTest({
  name: 'setup-config-with-in-repo-addons',
  path: require.resolve('./index.js'),
  fixtureDir: `${__dirname}/__testfixtures__/`,
});
