'use strict';

const { runTransformTest } = require('codemod-cli');

runTransformTest({
  name: 'setup-config-with-workspaces',
  path: require.resolve('./index.js'),
  fixtureDir: `${__dirname}/__testfixtures__/`,
});
