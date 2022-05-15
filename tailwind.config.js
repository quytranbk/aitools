module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    {
      pattern: /./,
      variants: ['hover', 'focus'],
    },
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
