import { defineCollection, z } from 'astro:content'

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    isDraft: z.boolean().optional().default(false),
    title: z.string(),
    desc: z.string(),
    date: z.date(),
  }),
})

export const collections = { blog }
