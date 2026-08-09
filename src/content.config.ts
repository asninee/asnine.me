import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: z
    .object({
      title: z.string().trim().min(1),
      desc: z.string().trim().min(1),
      published: z.coerce.date(),
      updated: z.coerce.date().optional(),
      draft: z.boolean().optional().default(false),
    })
    .refine(
      ({ published, updated }) => !updated || updated >= published,
      'Updated date cannot be before published date'
    ),
})

const notepad = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/notepad' }),
  schema: z.object({
    published: z.coerce.date(),
    draft: z.boolean().optional().default(false),
  }),
})

export const collections = { blog, notepad }
