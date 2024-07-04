import { defineCollection, z } from 'astro:content'

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    desc: z.string(),
    published: z.date(),
    updated: z.date().optional(),
    draft: z.boolean().optional().default(false),
  }),
})

const notepad = defineCollection({
  type: 'content',
  schema: z.object({
    published: z.date(),
    draft: z.boolean().optional().default(false),
  }),
})

export const collections = { blog, notepad }
