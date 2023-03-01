const { CONFIGURATION_TYPE } = require('./constants');

function determineConfigType(j, root) {
  let configurationType;
  let optionsName = undefined;

  root
    .find(j.NewExpression, {
      callee: {
        name: 'EmberApp',
      },
      arguments: [
        {
          type: 'Identifier',
          name: 'defaults',
        },
        {
          type: 'Identifier',
        },
      ],
    })
    .forEach((path) => {
      optionsName = path.node.arguments[1].name;
    });

  configurationType = CONFIGURATION_TYPE[optionsName === undefined ? 'INLINE' : 'USE_OPTIONS'];

  return {
    configurationType,
    optionsName,
  };
}

function hasBabelPluginEmberTestMetaData(j, root) {
  let callExpression = root.find(j.CallExpression, {
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

function addBabelProperty(j, root, babelObject, { configurationType, optionsName }) {
  if (configurationType === CONFIGURATION_TYPE.INLINE) {
    root.find(j.ObjectExpression).forEach((path) => {
      if (path.parent.node.callee && (path.parent.node.callee.name === 'EmberApp' || path.parent.node.callee.name === 'EmberAddon')) {
        path.node.properties.push(babelObject);
      }
    });
  } else {
    root.find(j.VariableDeclarator).forEach((path) => {
      let node = path.node;

      if (node.id.name === optionsName && node.init.type === 'ObjectExpression') {
        node.init.properties.push(babelObject);
      }
    });
  }
}

function addPluginsProperty(j, root, pluginsObject) {
  root.find(j.ObjectExpression).forEach((path) => {
    if (path.parent.node.key && path.parent.node.key.name === 'babel') {
      path.node.properties.push(pluginsObject);
    }
  });
}

function addBabelPluginConfig(j, root, hasCorrectBabelPluginEmberTestMetaData, babelPluginConfig) {
  if (hasCorrectBabelPluginEmberTestMetaData) {
    root
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
    root.find(j.ObjectExpression).forEach((path) => {
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

function getCorrectProjectWithWorkspacesConfig(j, root) {
  return root.find(j.ArrayExpression, {
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

function getCorrectConfig(j, root) {
  return root.find(j.ArrayExpression, {
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
  determineConfigType,
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
