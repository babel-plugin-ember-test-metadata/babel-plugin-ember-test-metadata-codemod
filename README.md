# babel-plugin-ember-test-metadata-codemod


A collection of codemods for babel-plugin-ember-test-metadata-codemod.

## Usage

To run a specific codemod from this project, you would run the following:

```
npx babel-plugin-ember-test-metadata-codemod <TRANSFORM NAME> path/of/files/ or/some**/*glob.js

# or

yarn global add babel-plugin-ember-test-metadata-codemod
babel-plugin-ember-test-metadata-codemod <TRANSFORM NAME> path/of/files/ or/some**/*glob.js
```

## Local Usage
```
node ./bin/cli.js <TRANSFORM NAME> path/of/files/ or/some**/*glob.js
```

## Transforms

<!--TRANSFORMS_START-->
* [setup-config](transforms/setup-config/README.md)
* [setup-config-with-workspaces](transforms/setup-config-with-workspaces/README.md)
<!--TRANSFORMS_END-->

## Contributing

### Installation

* clone the repo
* change into the repo directory
* `yarn`

### Running tests

* `yarn test`

### Update Documentation

* `yarn update-docs`