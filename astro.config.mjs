import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import icon from 'astro-icon'
import { defineConfig } from 'astro/config'

import cloudflare from '@astrojs/cloudflare'

// https://astro.build/config
export default defineConfig({
  site: 'https://asnine.me',
  output: 'hybrid',
  adapter: cloudflare(),
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    mdx(),
    icon(),
    sitemap(),
  ],
  markdown: {
    shikiConfig: {
      // https://shiki.style/guide/dual-themes
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      // https://shiki.style/languages
      langs: ['rs', 'go', 'astro'],
      wrap: false,
    },
  },
})
