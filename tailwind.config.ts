import defaultTheme from 'tailwindcss/defaultTheme'
import colors from './src/lib/colors'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    fontFamily: {
      sans: ['BDOGrotesk', ...defaultTheme.fontFamily.sans],
      mono: ['Iosevka', ...defaultTheme.fontFamily.mono],
    },
    extend: {
      colors: {
        'd/bg': colors.neutral[900],
        'd/pri': colors.neutral[300],
        'd/sec': colors.neutral[400],
        'd/sel': colors.neutral[800],
        'd/out': colors.neutral[600],
        'd/bor': colors.neutral[700],
        'l/bg': colors.neutral[100],
        'l/pri': colors.neutral[800],
        'l/sec': colors.neutral[600],
        'l/out': colors.neutral[300],
        'l/bor': colors.neutral[300],
      },
    },
  },
  plugins: [],
}
