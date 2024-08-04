import type { CollectionEntry } from 'astro:content'

export const sortPostsByDate = async (entries: CollectionEntry<'blog'>[]) =>
  entries.sort(
    (a, b) => b.data.published.getTime() - a.data.published.getTime()
  )

export const sortNotesByDate = async (entries: CollectionEntry<'notepad'>[]) =>
  entries.sort(
    (a, b) => b.data.published.getTime() - a.data.published.getTime()
  )
