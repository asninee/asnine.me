import type { CollectionEntry } from 'astro:content'

export const sortPostsByDate = async (entries: CollectionEntry<'blog'>[]) =>
  entries.sort((a, b) =>
    a.data.updated && b.data.updated
      ? b.data.updated.getTime() - a.data.updated.getTime()
      : a.data.updated && !b.data.updated
        ? b.data.published.getTime() - a.data.updated.getTime()
        : !a.data.updated && b.data.updated
          ? b.data.updated.getTime() - a.data.published.getTime()
          : b.data.published.getTime() - a.data.published.getTime()
  )

export const sortNotesByDate = async (entries: CollectionEntry<'notepad'>[]) =>
  entries.sort(
    (a, b) => b.data.published.getTime() - a.data.published.getTime()
  )

export const formatDate = (date: Date, isHome: boolean) =>
  isHome
    ? new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'numeric',
        year: '2-digit',
      }).format(date)
    : new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
      }).format(date)
