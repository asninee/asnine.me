import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import playformCompress from '@playform/compress'
import icon from 'astro-icon'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  site: 'https://asnine.me',
  integrations: [
    tailwind(),
    mdx(),
    sitemap(),
    icon(),
    playformCompress({
      CSS: false,
    }),
  ],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'vitesse-light',
        dark: 'vitesse-dark',
      },
      wrap: false,
    },
  },
})
