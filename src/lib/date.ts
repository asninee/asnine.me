import type { CollectionEntry } from 'astro:content'

export type DateFormat = 'short' | 'withYear'

export const sortPostsByDate = (entries: CollectionEntry<'blog'>[]) =>
  entries.toSorted((a, b) =>
    a.data.updated && b.data.updated
      ? b.data.updated.getTime() - a.data.updated.getTime()
      : a.data.updated && !b.data.updated
        ? b.data.published.getTime() - a.data.updated.getTime()
        : !a.data.updated && b.data.updated
          ? b.data.updated.getTime() - a.data.published.getTime()
          : b.data.published.getTime() - a.data.published.getTime()
  )

export const sortNotesByDate = (entries: CollectionEntry<'notepad'>[]) =>
  entries.toSorted(
    (a, b) => b.data.published.getTime() - a.data.published.getTime()
  )

export const formatDate = (date: Date, format: DateFormat) =>
  format === 'withYear'
    ? new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'numeric',
        year: '2-digit',
      }).format(date)
    : new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
      }).format(date)
