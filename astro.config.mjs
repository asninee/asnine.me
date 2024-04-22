import tailwind from '@astrojs/tailwind'
import { defineConfig } from 'astro/config'

import mdx from '@astrojs/mdx'

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
        light: 'min-light',
        dark: 'min-dark',
      },
      // https://shiki.style/languages
      langs: ['js', 'rs'],
      wrap: true,
      // Add custom transformers: https://shiki.style/guide/transformers
      // Find common transformers: https://shiki.style/packages/transformers
      transformers: [],
    },
  },
})
