import tailwindColors from 'tailwindcss/colors'
import plugin from 'tailwindcss/plugin'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    fontFamily: {
      sans: [
        '"Helvetica Neue"',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
        '"Noto Color Emoji"',
      ],
      serif: [
        '"Brygada 1918"',
        'ui-serif',
        'Georgia',
        'Cambria',
        '"Times New Roman"',
        'serif',
      ],
      mono: [
        'SFMono-Regular',
        'ui-monospace',
        'Menlo',
        'Monaco',
        'Consolas',
        '"Liberation Mono"',
        'monospace',
      ],
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
      animation: {
        'scale-up': 'scale-up 150ms ease-in',
      },
      keyframes: {
        'scale-up': {
          '0%': { transform: 'scale(0.9)', opacity: 0 },
          '70%': { transform: 'scale(1.02)', opacity: 0.7 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
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
