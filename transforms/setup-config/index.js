const { getParser } = require('codemod-cli').jscodeshift;

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

  let enabledProperty = j.property(
    'init',
    j.identifier('enabled'),
    j.unaryExpression(
      '!',
      j.unaryExpression(
        '!',
        j.memberExpression(
          j.memberExpression(j.identifier('process'), j.identifier('env')),
          j.identifier('BABEL_TEST_METADATA')
        )
      )
    )
  );

  let packageNameProperty = j.property(
    'init',
    j.identifier('packageName'),
    j.memberExpression(
      j.memberExpression(
        j.memberExpression(j.identifier('defaults'), j.identifier('project')),
        j.identifier('pkg')
      ),
      j.identifier('name')
    )
  );

  let isUsingEmbroiderProperty = j.property(
    'init',
    j.identifier('isUsingEmbroider'),
    j.unaryExpression(
      '!',
      j.unaryExpression(
        '!',
        j.memberExpression(
          j.memberExpression(j.identifier('process'), j.identifier('env')),
          j.identifier('EMBROIDER')
        )
      )
    )
  );

  let optionObject = j.objectExpression([
    enabledProperty,
    packageNameProperty,
    isUsingEmbroiderProperty,
  ]);

  let pluginsObject = j.property(
    'init',
    j.identifier('plugins'),
    j.arrayExpression([j.arrayExpression([requireCallExpression, optionObject])])
  );

  let babelObject = j.property('init', j.identifier('babel'), j.objectExpression([pluginsObject]));

  function transform() {
    let correctConfig = root.find(j.ArrayExpression).find(j.CallExpression, {
      callee: {
        object: {
          name: 'require',
        },
        property: {
          name: 'resolve',
        },
      },
      arguments: [
        {
          value: 'babel-plugin-ember-test-metadata',
        },
      ],
    });

    let emberApp = root.find(j.NewExpression, {
      callee: {
        name: 'EmberApp',
      },
    });

    let hasBabelProperty = false;
    let hasPluginsProperty = false;

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

    if (emberApp.length > 0 && correctConfig.length === 0) {
      if (!hasBabelProperty) {
        emberApp.find(j.ObjectExpression).forEach((path) => {
          if (path.parent.node.callee && path.parent.node.callee.name === 'EmberApp') {
            path.node.properties.push(babelObject);
          }
        });
      } else if (hasBabelProperty && !hasPluginsProperty) {
        emberApp.find(j.ObjectExpression).forEach((path) => {
          if (path.parent.node.key && path.parent.node.key.name === 'babel') {
            path.node.properties.push(pluginsObject);
          }
        });
      } else if (hasBabelProperty && hasPluginsProperty) {
        emberApp.find(j.ObjectExpression).forEach((path) => {
          let properties = path.node.properties;
          properties.forEach((property) => {
            if (property.key.name === 'plugins' && property.value.type === 'ArrayExpression') {
              property.value.elements.push(
                j.arrayExpression([requireCallExpression, optionObject])
              );
            }
          });
        });
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
