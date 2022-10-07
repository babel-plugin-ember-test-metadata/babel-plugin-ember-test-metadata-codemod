# setup-config


## Usage

```
npx babel-plugin-ember-test-metadata-codemod setup-config path/of/files/ or/some**/*glob.js

# or

yarn global add babel-plugin-ember-test-metadata-codemod
babel-plugin-ember-test-metadata-codemod setup-config path/of/files/ or/some**/*glob.js
```

## Local Usage
```
node ./bin/cli.js setup-config path/of/files/ or/some**/*glob.js
```

## Input / Output

<!--FIXTURES_TOC_START-->
* [test-already-setup](#test-already-setup)
* [test-with-babel-property](#test-with-babel-property)
* [test-with-individual-options](#test-with-individual-options)
* [test-with-plugin-property](#test-with-plugin-property)
* [test-without-babel-property](#test-without-babel-property)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="test-already-setup">**test-already-setup**</a>

**Input** (<small>[test-already-setup.input.js](transforms/setup-config/__testfixtures__/test-already-setup.input.js)</small>):
```js
'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    babel: {
      plugins: [
        [
          require.resolve('babel-plugin-ember-test-metadata'),
          {
            enabled: !!process.env.BABEL_TEST_METADATA,
            packageName: defaults.project.pkg.name,
            isUsingEmbroider: !!process.env.EMBROIDER,
          },
        ],
      ],
    },
  });

  // additional configuration

  return app.toTree();
};

```

**Output** (<small>[test-already-setup.output.js](transforms/setup-config/__testfixtures__/test-already-setup.output.js)</small>):
```js
'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    babel: {
      plugins: [
        [
          require.resolve('babel-plugin-ember-test-metadata'),
          {
            enabled: !!process.env.BABEL_TEST_METADATA,
            packageName: defaults.project.pkg.name,
            isUsingEmbroider: !!process.env.EMBROIDER,
          },
        ],
      ],
    },
  });

  // additional configuration

  return app.toTree();
};

```
---
<a id="test-with-babel-property">**test-with-babel-property**</a>

**Input** (<small>[test-with-babel-property.input.js](transforms/setup-config/__testfixtures__/test-with-babel-property.input.js)</small>):
```js
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

    },
  });

  // additional configuration

  return app.toTree();
};

```

**Output** (<small>[test-with-babel-property.output.js](transforms/setup-config/__testfixtures__/test-with-babel-property.output.js)</small>):
```js
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
      plugins: [[require.resolve('babel-plugin-ember-test-metadata'), {
        enabled: !!process.env.BABEL_TEST_METADATA,
        packageName: defaults.project.pkg.name,
        isUsingEmbroider: !!process.env.EMBROIDER,
      }]],
    },
  });

  // additional configuration

  return app.toTree();
};

```
---
<a id="test-with-individual-options">**test-with-individual-options**</a>

**Input** (<small>[test-with-individual-options.input.js](transforms/setup-config/__testfixtures__/test-with-individual-options.input.js)</small>):
```js
'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  const options = {
    emberHighCharts: {
      includeHighCharts: true,
      includeHighStock: false,
      includeHighChartsMore: true,
      includeHighCharts3D: true,
      includeModules: ['solid-gauge'],
    },
  }

  let app = new EmberApp(defaults, options);

  // additional configuration

  return app.toTree();
};

```

**Output** (<small>[test-with-individual-options.output.js](transforms/setup-config/__testfixtures__/test-with-individual-options.output.js)</small>):
```js
'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  const options = {
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
      }]],
    },
  }

  let app = new EmberApp(defaults, options);

  // additional configuration

  return app.toTree();
};

```
---
<a id="test-with-plugin-property">**test-with-plugin-property**</a>

**Input** (<small>[test-with-plugin-property.input.js](transforms/setup-config/__testfixtures__/test-with-plugin-property.input.js)</small>):
```js
'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    babel: {
      plugins: [],
    },
  });

  // additional configuration

  return app.toTree();
};

```

**Output** (<small>[test-with-plugin-property.output.js](transforms/setup-config/__testfixtures__/test-with-plugin-property.output.js)</small>):
```js
'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    babel: {
      plugins: [[require.resolve('babel-plugin-ember-test-metadata'), {
        enabled: !!process.env.BABEL_TEST_METADATA,
        packageName: defaults.project.pkg.name,
        isUsingEmbroider: !!process.env.EMBROIDER,
      }]],
    },
  });

  // additional configuration

  return app.toTree();
};

```
---
<a id="test-without-babel-property">**test-without-babel-property**</a>

**Input** (<small>[test-without-babel-property.input.js](transforms/setup-config/__testfixtures__/test-without-babel-property.input.js)</small>):
```js
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
  });

  // additional configuration

  return app.toTree();
};

```

**Output** (<small>[test-without-babel-property.output.js](transforms/setup-config/__testfixtures__/test-without-babel-property.output.js)</small>):
```js
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
      plugins: [[require.resolve('babel-plugin-ember-test-metadata'), {
        enabled: !!process.env.BABEL_TEST_METADATA,
        packageName: defaults.project.pkg.name,
        isUsingEmbroider: !!process.env.EMBROIDER,
      }]],
    },
  });

  // additional configuration

  return app.toTree();
};

```
<!--FIXTURES_CONTENT_END-->