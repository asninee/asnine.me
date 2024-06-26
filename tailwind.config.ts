import tailwindColors from 'tailwindcss/colors'
import defaultTheme from 'tailwindcss/defaultTheme'
import plugin from 'tailwindcss/plugin'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    fontFamily: {
      sans: ['Nacelle', ...defaultTheme.fontFamily.sans],
      serif: ['Newsreader', ...defaultTheme.fontFamily.serif],
      mono: ['Commit Mono', ...defaultTheme.fontFamily.mono],
    },
    colors: {
      inherit: tailwindColors.inherit,
      current: tailwindColors.current,
      transparent: tailwindColors.transparent,
      black: tailwindColors.black,
      white: tailwindColors.white,
      gray: tailwindColors.neutral,
    },
    extend: {
      maxWidth: {
        container: '43rem',
      },
    },
  },

  plugins: [
    plugin(({ addVariant }) => {
      addVariant('selected', '&[aria-selected="true"]')
      addVariant('current', '&[aria-current="true"]')
    }),
  ],
}
