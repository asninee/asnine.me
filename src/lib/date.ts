import type { CollectionEntry } from 'astro:content'

export const sortPostsByDate = (entries: CollectionEntry<'blog'>[]) =>
  entries.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())

export const sortNotesByDate = (entries: CollectionEntry<'notes'>[]) =>
  entries.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
