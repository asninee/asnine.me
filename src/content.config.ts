import { glob } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'

const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    desc: z.string(),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    draft: z.boolean().optional().default(false),
  }),
})

const notepad = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/notepad' }),
  schema: z.object({
    published: z.coerce.date(),
    draft: z.boolean().optional().default(false),
  }),
})

export const collections = { blog, notepad }
