/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

const addStyleResource = (rule) => {
  rule
    .use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, './src/assets/scss/_variables.scss'),
        path.resolve(__dirname, './src/assets/scss/_mixins.scss'),
      ],
      injector: (source, resources) => {
        // FIXME: simply ignore @use
        if (/^\s*@use/.test(source)) {
          return source;
        }

        return resources.map(({ content }) => content).join('') + source;
      },
    });
};

module.exports = {
  chainWebpack: (config) => {
    // webpack alias
    const srcDir = config.resolve.alias.get('@');
    config.resolve.alias.set('@styles', path.join(srcDir, 'assets/scss'));
    config.resolve.alias.set('@use', path.join(srcDir, 'hooks'));

    // define plugins
    config.plugin('define').tap((definitions) => {
      definitions[0] = Object.assign(definitions[0], {
        __DEV__: definitions[0]['process.env']['NODE_ENV'] !== 'production',
      });
      return definitions;
    });

    // style-resource-loader
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal'];
    types.forEach((type) =>
      addStyleResource(config.module.rule('scss').oneOf(type))
    );
  },

  devServer: {
    proxy: {
      // '^/mock': {
      //   target: 'http://localhost:3002',
      //   pathRewrite: { '^/mock': '' },
      // },

      '^/hn/': {
        target: 'http://hn.algolia.com/api/v1',
        pathRewrite: {
          '^/hn': '',
        },
      },

      '^/json/': {
        // target: 'https://jsonplaceholder.typicode.com/',
        target:
          'https://my-json-server.typicode.com/blooddrunk/my-json-server/',
        pathRewrite: {
          '^/json': '',
        },
      },
    },
  },

  publicPath: process.env.VUE_APP_PUBLIC_PATH,
};
