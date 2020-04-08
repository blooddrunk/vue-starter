const { join } = require('path');

const isDev = process.env.NODE_ENV === 'development';
const tailwindConfig = join(__dirname, 'tailwind.config.js');

const plugins = {
  tailwindcss: tailwindConfig
};

if (!isDev) {
  plugins['@fullhuman/postcss-purgecss'] = {
    content: [`./public/**/*.html`, `./src/**/*.vue`],
    css: ['src/assets/css/tailwind.css'],
    defaultExtractor(content) {
      const contentWithoutStyleBlocks = content.replace(
        /<style[^]+?<\/style>/gi,
        ''
      );
      return (
        contentWithoutStyleBlocks.match(/[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]+/g) ||
        []
      );
    },
    whitelist: ['html', 'body'],
    whitelistPatterns: [
      /-(leave|enter|appear)(|-(to|from|active))$/,
      /^(?!(|.*?:)cursor-move).+-move$/,
      /^router-link(|-exact)-active$/,
      /data-v-.*/
    ]
  };
}

module.exports = {
  plugins
};
