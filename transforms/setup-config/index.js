const { getParser } = require('codemod-cli').jscodeshift;
const {
  hasBabelPluginEmberTestMetaData,
  addBabelProperty,
  addPluginsProperty,
  addBabelPluginConfig,
  getCorrectConfig,
  getEnabledProperty,
  getPackageNameProperty,
  getUsingEmboriderProperty,
  getPluginsObject,
  getBabelObject,
} = require('../utils');

module.exports = function transformer(file, api) {
  const j = getParser(api);
  const root = j(file.source);

  let requireMemberExpression = j.memberExpression(
    j.identifier('require'),
    j.identifier('resolve')
  );

  let requireCallExpression = j.callExpression(requireMemberExpression, [
    j.literal('babel-plugin-ember-test-metadata'),
  ]);

  function transform() {
    let emberApp = root.find(j.NewExpression, {
      callee: {
        name: 'EmberApp',
      },
    });

    let hasBabelProperty = false;
    let hasPluginsProperty = false;

    let correctConfig = getCorrectConfig(j, emberApp);
    let enabledProperty = getEnabledProperty(j);
    let packageNameProperty = getPackageNameProperty(j);
    let isUsingEmbroiderProperty = getUsingEmboriderProperty(j);

    let hasCorrectBabelPluginEmberTestMetaData = hasBabelPluginEmberTestMetaData(j, emberApp);

    let optionObject = j.objectExpression([
      enabledProperty,
      packageNameProperty,
      isUsingEmbroiderProperty,
    ]);

    let pluginsObject = getPluginsObject(j, optionObject, requireCallExpression);
    let babelObject = getBabelObject(j, pluginsObject);

    let babelPluginConfig = [requireCallExpression, optionObject];

    emberApp.find(j.ObjectExpression).forEach((path) => {
      let properties = path.node.properties;

      properties.forEach((property) => {
        if (property.key.name === 'babel') {
          hasBabelProperty = true;
        }
        if (property.key.name === 'plugins') {
          hasPluginsProperty = true;
        }
      });
    });

    if (correctConfig.length === 0) {
      if (!hasBabelProperty) {
        addBabelProperty(j, emberApp, babelObject);
      } else if (hasBabelProperty && !hasPluginsProperty) {
        addPluginsProperty(j, emberApp, pluginsObject);
      } else if (hasBabelProperty && hasPluginsProperty) {
        addBabelPluginConfig(
          j,
          emberApp,
          hasCorrectBabelPluginEmberTestMetaData,
          babelPluginConfig
        );
      }
    }
  }

  transform();

  return root.toSource({
    quote: 'single',
    trailingComma: true,
  });
};

module.exports.type = 'js';
