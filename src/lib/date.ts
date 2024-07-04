import type { CollectionEntry } from 'astro:content'

export const sortPostsByDate = (entries: CollectionEntry<'blog'>[]) =>
  entries.sort(
    (a, b) => b.data.published.getTime() - a.data.published.getTime()
  )

export const sortNotesByDate = (entries: CollectionEntry<'notepad'>[]) =>
  entries.sort(
    (a, b) => b.data.published.getTime() - a.data.published.getTime()
  )
