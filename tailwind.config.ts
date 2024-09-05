import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,md,mdx,ts}'],
  theme: {
    fontFamily: {
      sans: ['OpeningHoursSans', ...defaultTheme.fontFamily.sans],
      mono: ['Iosevka', ...defaultTheme.fontFamily.mono],
    },
    extend: {
      colors: {
        bg: 'var(--bg)',
        pri: 'var(--pri)',
        sec: 'var(--sec)',
        sel: 'var(--sel)',
        out: 'var(--out)',
        bor: 'var(--bor)',
      },
    },
  },
  plugins: [],
}
