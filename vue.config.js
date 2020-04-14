const path = require('path');

module.exports = {
  chainWebpack: (config) => {
    // webpack alias
    const srcDir = config.resolve.alias.get('@');
    config.resolve.alias.set('~styles', path.join(srcDir, 'assets/scss'));

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
        target: 'https://jsonplaceholder.typicode.com/',
        pathRewrite: {
          '^/json': '',
        },
      },
    },
  },

  publicPath: process.env.VUE_APP_PUBLIC_PATH,
};

function addStyleResource(rule) {
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
}
