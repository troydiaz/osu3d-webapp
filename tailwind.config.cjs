/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'), 
    require("daisyui")
  ],
  daisyui: {
    themes: [
      {
        "beaves": "#"
      },
      'light',
      'lofi',
      'black',
      'fantasy',
      'sunset',
      'dim',
      'winter',
      'cmyk',
      'wireframe',
      'cyberpunk',
      'coffee',
      'aqua',
      'dark',
      'night',
      'dracula',
      'synthwave'
    ],
    logs: false,
  }
}
