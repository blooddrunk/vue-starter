const path = require('path');

module.exports = {
  // chainWebpack: (config) => {
  //   const srcDir = config.resolve.alias.get('@');
  //   config.resolve.alias.set('styles', path.join(srcDir, 'assets/scss'));
  // },

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

      // '^/js/': {
      //   target: 'https://my-json-server.typicode.com/blooddrunk/my-json-server',
      //   pathRewrite: {
      //     '^/js': '',
      //   },
      // },
    },
  },

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        path.resolve(__dirname, './src/assets/scss/_variables.scss'),
        path.resolve(__dirname, './src/assets/scss/_mixins.scss'),
      ],
    },
  },

  // publicPath: process.env.VUE_APP_PUBLIC_PATH,
};
