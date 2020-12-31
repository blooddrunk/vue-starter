const isDev = process.env.NODE_ENV === 'development';

// https://github.com/nuxt/nuxt.js/blob/ed564c3bd8/packages/webpack/src/utils/postcss.js
module.exports = {
  plugins: {
    // https://github.com/tailwindcss/tailwindcss
    tailwindcss: {},

    // https://github.com/postcss/postcss-import
    // 'postcss-import': {},

    // https://github.com/postcss/postcss-url
    'postcss-url': {},

    // https://github.com/csstools/postcss-preset-env
    // defaults to stage 2
    'postcss-preset-env': {
      stage: 1,
    },

    // https://github.com/cssnano/cssnano
    cssnano: isDev ? false : { preset: 'default' },
  },
};
