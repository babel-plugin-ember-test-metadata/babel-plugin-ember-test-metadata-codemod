# setup-config-with-in-repo-addons


## Usage

```
npx babel-plugin-ember-test-metadata-codemod setup-config-with-in-repo-addons path/of/files/ or/some**/*glob.js

# or

yarn global add babel-plugin-ember-test-metadata-codemod
babel-plugin-ember-test-metadata-codemod setup-config-with-in-repo-addons path/of/files/ or/some**/*glob.js
```

## Local Usage
```
node ./bin/cli.js setup-config-with-in-repo-addons path/of/files/ or/some**/*glob.js
```

## Input / Output

<!--FIXTURES_TOC_START-->
* [basic](#basic)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="basic">**basic**</a>

**Input** (<small>[basic.input.js](transforms/setup-config-with-in-repo-addons/__testfixtures__/basic.input.js)</small>):
```js
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
  });

  // additional configuration

  return app.toTree();
};

```

**Output** (<small>[basic.output.js](transforms/setup-config-with-in-repo-addons/__testfixtures__/basic.output.js)</small>):
```js
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
      plugins: [[require.resolve('babel-plugin-ember-test-metadata'), {
        enabled: !!process.env.BABEL_TEST_METADATA,
        packageName: defaults.project.pkg.name,
        isUsingEmbroider: !!process.env.EMBROIDER,
        projectRoot: '../..',
      }]],
    },
  });

  // additional configuration

  return app.toTree();
};

```
<!--FIXTURES_CONTENT_END-->