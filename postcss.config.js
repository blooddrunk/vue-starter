/* eslint-disable @typescript-eslint/no-var-requires */
const { join } = require('path');

const isDev = process.env.NODE_ENV === 'development';
const tailwindConfig = join(__dirname, 'tailwind.config.js');

// if (!isDev) {
//   plugins['@fullhuman/postcss-purgecss'] = {
//     content: [`./public/**/*.html`, `./src/**/*.vue`],

//     // FIXME: not working
//     css: ['src/assets/css/tailwind.css'],

//     defaultExtractor(content) {
//       const contentWithoutStyleBlocks = content.replace(
//         /<style[^]+?<\/style>/gi,
//         ''
//       );
//       return (
//         contentWithoutStyleBlocks.match(/[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]+/g) ||
//         []
//       );
//     },
//     whitelist: ['html', 'body'],
//     whitelistPatterns: [
//       /-(leave|enter|appear)(|-(to|from|active))$/,
//       /^(?!(|.*?:)cursor-move).+-move$/,
//       /^router-link(|-exact)-active$/,
//       /data-v-.*/,
//     ],
//   };
// }

// https://github.com/nuxt/nuxt.js/blob/ed564c3bd8/packages/webpack/src/utils/postcss.js
module.exports = {
  plugins: {
    // https://github.com/tailwindcss/tailwindcss
    tailwindcss: tailwindConfig,

    // https://github.com/postcss/postcss-import
    'postcss-import': {},

    // https://github.com/postcss/postcss-url
    'postcss-url': {},

    // https://github.com/csstools/postcss-preset-env
    // defaults to stage 2
    'postcss-preset-env': {},

    // https://github.com/cssnano/cssnano
    cssnano: isDev ? false : { preset: 'default' },
  },
};
