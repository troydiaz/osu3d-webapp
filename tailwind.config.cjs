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
        osu3d: {
          "primary": "#ffeeaa",
          "secondary": "#d48800",
          "accent": "#297e7c",
          "neutral": "#102e33",
          "base-100": "#F0EFF6",
          "info": "#7183DA",
          "success": "#92c46d",
          "warning": "#ffdd55",
          "error": "#f85959",
        }
      },
      'cmyk'
    ],
  }
}
