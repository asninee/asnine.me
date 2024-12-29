import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import playformCompress from '@playform/compress'
import tailwindcss from '@tailwindcss/vite'
import icon from 'astro-icon'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  site: 'https://asnine.me',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [mdx(), sitemap(), icon(), playformCompress()],
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
