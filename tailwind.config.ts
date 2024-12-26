import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,md,mdx,ts}'],
  theme: {
    fontFamily: {
      sans: ['Helvetica Neue', ...defaultTheme.fontFamily.sans],
      mono: ['monospace', ...defaultTheme.fontFamily.mono],
    },
    extend: {
      colors: {
        bg: 'var(--bg)',
        pri: 'var(--pri)',
        sec: 'var(--sec)',
        bor: 'var(--bor)',
      },
    },
  },
  plugins: [],
}
