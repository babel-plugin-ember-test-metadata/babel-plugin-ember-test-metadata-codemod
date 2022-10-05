function hasBabelPluginEmberTestMetaData(j, emberApp) {
  let callExpression = emberApp.find(j.CallExpression, {
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

  return callExpression.length !== 0;
}

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

function addBabelPluginConfig(
  j,
  emberApp,
  hasCorrectBabelPluginEmberTestMetaData,
  babelPluginConfig
) {
  if (hasCorrectBabelPluginEmberTestMetaData) {
    emberApp
      .find(j.CallExpression, {
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
      })
      .forEach((path) => {
        path.parent.node.elements = babelPluginConfig;
      });
  } else {
    emberApp.find(j.ObjectExpression).forEach((path) => {
      let properties = path.node.properties;
      properties.forEach((property) => {
        if (property.key.name === 'plugins' && property.value.type === 'ArrayExpression') {
          property.value.elements.push(j.arrayExpression(babelPluginConfig));
        }
      });
    });
  }
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

function getCorrectProjectWithWorkspacesConfig(j, emberApp) {
  return emberApp.find(j.ArrayExpression, {
    elements: [
      {
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
      },
      {
        properties: [
          {
            key: {
              name: 'enabled',
            },
            value: {
              operator: '!',
              argument: {
                operator: '!',
                argument: {
                  object: {
                    object: {
                      name: 'process',
                    },
                    property: {
                      name: 'env',
                    },
                  },
                  property: {
                    name: 'BABEL_TEST_METADATA',
                  },
                },
              },
            },
          },
          {
            key: {
              name: 'packageName',
            },
            value: {
              property: {
                name: 'name',
              },
              object: {
                property: {
                  name: 'pkg',
                },
                object: {
                  property: {
                    name: 'project',
                  },
                  object: {
                    name: 'defaults',
                  },
                },
              },
            },
          },
          {
            key: {
              name: 'isUsingEmbroider',
            },
            value: {
              operator: '!',
              argument: {
                operator: '!',
                argument: {
                  object: {
                    object: {
                      name: 'process',
                    },
                    property: {
                      name: 'env',
                    },
                  },
                  property: {
                    name: 'EMBROIDER',
                  },
                },
              },
            },
          },
          {
            key: {
              name: 'projectRoot',
            },
            value: {
              value: '../..',
            },
          },
        ],
      },
    ],
  });
}

function getCorrectConfig(j, emberApp) {
  return emberApp.find(j.ArrayExpression, {
    elements: [
      {
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
      },
      {
        properties: [
          {
            key: {
              name: 'enabled',
            },
            value: {
              operator: '!',
              argument: {
                operator: '!',
                argument: {
                  object: {
                    object: {
                      name: 'process',
                    },
                    property: {
                      name: 'env',
                    },
                  },
                  property: {
                    name: 'BABEL_TEST_METADATA',
                  },
                },
              },
            },
          },
          {
            key: {
              name: 'packageName',
            },
            value: {
              property: {
                name: 'name',
              },
              object: {
                property: {
                  name: 'pkg',
                },
                object: {
                  property: {
                    name: 'project',
                  },
                  object: {
                    name: 'defaults',
                  },
                },
              },
            },
          },
          {
            key: {
              name: 'isUsingEmbroider',
            },
            value: {
              operator: '!',
              argument: {
                operator: '!',
                argument: {
                  object: {
                    object: {
                      name: 'process',
                    },
                    property: {
                      name: 'env',
                    },
                  },
                  property: {
                    name: 'EMBROIDER',
                  },
                },
              },
            },
          },
        ],
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
  hasBabelPluginEmberTestMetaData,
  addBabelProperty,
  addPluginsProperty,
  addBabelPluginConfig,
  getCorrectConfig,
  getCorrectProjectWithWorkspacesConfig,
  getEnabledProperty,
  getPackageNameProperty,
  getProjectRootProperty,
  getUsingEmboriderProperty,
  getPluginsObject,
  getBabelObject,
};
