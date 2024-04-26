import mdx from '@astrojs/mdx'
import tailwind from '@astrojs/tailwind'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({
      applyBaseStyles: false,
      nesting: true,
    }),
    mdx(),
  ],
  markdown: {
    shikiConfig: {
      // https://shiki.style/guide/dual-themes
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      // https://shiki.style/languages
      langs: ['js', 'ts', 'rs', 'go'],
      wrap: false,
    },
  },
})
