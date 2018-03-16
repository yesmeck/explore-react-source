const path = require('path');
const webpack = require('webpack');
const { injectBabelPlugin, getLoader, loaderNameMatches } = require('react-app-rewired');

module.exports = function override(config, env) {
  config = injectBabelPlugin(
    [
      'module-resolver',
      {
        alias: {
          '^events/(.+)': ([, name]) => path.resolve(__dirname, `src/react/packages/events/${name}`),
        },
      },
    ],
    config,
  );

  config.resolve.alias = {
    react: path.resolve(__dirname, 'src/react/packages/react'),
    'react-dom': path.resolve(__dirname, 'src/react/packages/react-dom'),
    shared: path.resolve(__dirname, 'src/react/packages/shared'),
    'react-events': path.resolve(__dirname, 'src/react/packages/events'),
    'react-reconciler': path.resolve(
      __dirname,
      'src/react/packages/react-reconciler'
    ),
  };

  const eslintLoader = getLoader(
    config.module.rules,
    rule => {
      if (rule.use && loaderNameMatches(rule.use[0], 'eslint-loader')) {
        console.log(rule);
        config.module.rules.splice(config.module.rules.indexOf(rule), 1);
      }
    },
  );

  config.plugins.push(
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(true),
    })
  );
  //do stuff with the webpack config...
  return config;
};
