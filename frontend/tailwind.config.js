module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Nunito', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#764ba2',
          light: '#667eea',
        },
        accent: '#ffb347',
        danger: '#dc3545',
        success: '#38b2ac',
      },
    },
  },
  plugins: [],
};
