import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import playformCompress from '@playform/compress'
import tailwindcss from '@tailwindcss/vite'
import icon from 'astro-icon'
import { defineConfig } from 'astro/config'
import sonda from 'sonda/astro'
import tailwindcssCleaner from 'vite-plugin-tailwindcss-cleaner'

// https://astro.build/config
export default defineConfig({
  site: 'https://asnine.me',
  vite: {
    plugins: [tailwindcss(), tailwindcssCleaner()],
    build: {
      sourcemap: true,
    },
  },
  integrations: [
    mdx(),
    sitemap(),
    sonda({
      server: true,
    }),
    icon(),
    playformCompress({
      CSS: {
        lightningcss: {
          unusedSymbols: [],
        },
      },
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
