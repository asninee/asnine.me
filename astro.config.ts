import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';
import { defineConfig } from 'astro/config';
import playformCompress from "@playform/compress";

// https://astro.build/config
export default defineConfig({
  site: 'https://asnine.me',
  integrations: [tailwind(), mdx(), icon(), sitemap(), playformCompress()],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark'
      },
      wrap: false
    }
  }
});