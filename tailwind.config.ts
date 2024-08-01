import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    fontFamily: {
      sans: ['BDOGrotesk', ...defaultTheme.fontFamily.sans],
      serif: ['CrimsonPro', ...defaultTheme.fontFamily.serif],
      mono: ['Iosevka', ...defaultTheme.fontFamily.mono],
    },
  },
  plugins: [],
}
