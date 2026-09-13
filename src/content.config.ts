import { defineCollection } from 'astro:content'
import { glob, type Loader } from 'astro/loaders'
import { z } from 'astro/zod'
import { getNotePublishedDate } from './lib/note-date'

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

const noteFiles = glob({ pattern: '**/*.mdx', base: './src/content/notepad' })

const datedNoteFiles: Loader = {
  ...noteFiles,
  name: 'dated-note-files',
  load: context =>
    noteFiles.load({
      ...context,
      parseData: ({ id, data, filePath }) =>
        context.parseData({
          id,
          data: { ...data, published: getNotePublishedDate(id) },
          filePath,
        }),
    }),
}

const notepad = defineCollection({
  loader: datedNoteFiles,
  schema: z.object({
    published: z.coerce.date(),
    draft: z.boolean().optional().default(false),
  }),
})

export const collections = { blog, notepad }
