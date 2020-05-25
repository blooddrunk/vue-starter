module.exports = {
  prefix: 'tw-',
  important: true,

  purge: {
    content: [`./public/**/*.html`, `./src/**/*.vue`],

    options: {
      whitelist: ['html', 'body'],
      whitelistPatterns: [
        /-(leave|enter|appear)(|-(to|from|active))$/,
        /^(?!(|.*?:)cursor-move).+-move$/,
        /^router-link(|-exact)-active$/,
        /data-v-.*/,
      ],
    },
  },

  theme: {
    extend: {
      borderWidth: {
        thin: 'thin',
      },

      screens: {
        dark: { raw: '(prefers-color-scheme: dark)' },
        light: { raw: '(prefers-color-scheme: light)' },
      },

      colors: {
        inherit: 'inherit',
      },

      backgroundColor: {
        primary: ' #f0f2f3',
        secondary: '#153455',
      },

      textColor: {
        primary: '#586779',
        secondary: '#0aabf6',
        accent: '#1486cd',
      },
    },
  },

  variants: {},
  plugins: [],
};
