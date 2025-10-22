module.exports = {
<<<<<<< HEAD
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
=======
  plugins: [
    require('@tailwindcss/postcss')(),
    require('autoprefixer'),
  ],
>>>>>>> 9491d7e6213a5e25ee6fdc2936818618a3dc64a4
};