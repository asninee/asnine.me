import cloudflare from '@astrojs/cloudflare'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import icon from 'astro-icon'
import { defineConfig } from 'astro/config'

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
  vite: {
    ssr: {
      external: ['node:path', 'node:fs', '@resvg/resvg-js'],
    },
    resolve: {
      alias: {
        path: 'node:path',
        fs: 'node:fs',
      },
    },
    build: {
      rollupOptions: {
        external: ['@resvg/resvg-js'],
      },
    },
    optimizeDeps: {
      exclude: ['@resvg/resvg-js'],
    },
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: false,
    },
  },
})
