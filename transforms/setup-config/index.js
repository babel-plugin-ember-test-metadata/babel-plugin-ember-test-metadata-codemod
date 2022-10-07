const { getParser } = require('codemod-cli').jscodeshift;
const {
  determineConfigType,
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
    let hasBabelProperty = false;
    let hasPluginsProperty = false;

    let { configurationType, optionsName } = determineConfigType(j, root);
    let correctConfig = getCorrectConfig(j, root);
    let enabledProperty = getEnabledProperty(j);
    let packageNameProperty = getPackageNameProperty(j);
    let isUsingEmbroiderProperty = getUsingEmboriderProperty(j);

    let hasCorrectBabelPluginEmberTestMetaData = hasBabelPluginEmberTestMetaData(j, root);

    let optionObject = j.objectExpression([
      enabledProperty,
      packageNameProperty,
      isUsingEmbroiderProperty,
    ]);

    let pluginsObject = getPluginsObject(j, optionObject, requireCallExpression);
    let babelObject = getBabelObject(j, pluginsObject);

    let babelPluginConfig = [requireCallExpression, optionObject];

    root.find(j.ObjectExpression).forEach((path) => {
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
        addBabelProperty(j, root, babelObject, { configurationType, optionsName });
      } else if (hasBabelProperty && !hasPluginsProperty) {
        addPluginsProperty(j, root, pluginsObject);
      } else if (hasBabelProperty && hasPluginsProperty) {
        addBabelPluginConfig(j, root, hasCorrectBabelPluginEmberTestMetaData, babelPluginConfig);
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
