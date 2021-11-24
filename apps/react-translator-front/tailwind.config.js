const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');
const { join } = require('path');
const colors = require('tailwindcss/colors')

module.exports = {
  purge: [
    join(__dirname, 'src/app/**/**/**/*.{js,ts,jsx,tsx}'),
    join(__dirname, 'src/app/**/**/*.{js,ts,jsx,tsx}'),
    join(__dirname, 'src/app/**/*.{js,ts,jsx,tsx}'),
    join(__dirname, 'src/app/*.{js,ts,jsx,tsx}'),
    join(__dirname, 'src/index.html'),
    ...createGlobPatternsForDependencies(__dirname)
  ],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',

        black: colors.black,
        white: colors.white,
        gray: colors.coolGray,
        red: colors.red,
        yellow: colors.amber,
        teal: colors.teal,
        green: colors.emerald,
        blue: colors.blue,
        indigo: colors.indigo,
        purple: colors.violet,
        pink: colors.pink,
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
