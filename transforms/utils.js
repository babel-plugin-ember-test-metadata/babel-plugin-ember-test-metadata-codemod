function addBabelProperty(j, emberApp, babelObject) {
  emberApp.find(j.ObjectExpression).forEach((path) => {
    if (path.parent.node.callee && path.parent.node.callee.name === 'EmberApp') {
      path.node.properties.push(babelObject);
    }
  });
}

function addPluginsProperty(j, emberApp, pluginsObject) {
  emberApp.find(j.ObjectExpression).forEach((path) => {
    if (path.parent.node.key && path.parent.node.key.name === 'babel') {
      path.node.properties.push(pluginsObject);
    }
  });
}

function addOptionObject(j, emberApp, requireCallExpression, optionObject) {
  emberApp.find(j.ObjectExpression).forEach((path) => {
    let properties = path.node.properties;
    properties.forEach((property) => {
      if (property.key.name === 'plugins' && property.value.type === 'ArrayExpression') {
        property.value.elements.push(j.arrayExpression([requireCallExpression, optionObject]));
      }
    });
  });
}

function getEnabledProperty(j) {
  return j.property(
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
}

function getPackageNameProperty(j) {
  return j.property(
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
}

function getProjectRootProperty(j) {
  return j.property('init', j.identifier('projectRoot'), j.literal('../..'));
}

function getUsingEmboriderProperty(j) {
  return j.property(
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
}

function getCorrectConfig(j, root) {
  return root.find(j.ArrayExpression).find(j.CallExpression, {
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
}

function getPluginsObject(j, optionObject, requireCallExpression) {
  return j.property(
    'init',
    j.identifier('plugins'),
    j.arrayExpression([j.arrayExpression([requireCallExpression, optionObject])])
  );
}

function getBabelObject(j, pluginsObject) {
  return j.property('init', j.identifier('babel'), j.objectExpression([pluginsObject]));
}

module.exports = {
  addBabelProperty,
  addPluginsProperty,
  addOptionObject,
  getCorrectConfig,
  getEnabledProperty,
  getPackageNameProperty,
  getProjectRootProperty,
  getUsingEmboriderProperty,
  getPluginsObject,
  getBabelObject,
};
