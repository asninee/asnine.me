import { getCollection, type CollectionEntry } from 'astro:content'
import { sortNotesByDate } from './date'

export type Notes = {
  [date: string]: CollectionEntry<'notes'>[]
}

export const getNotes = async (limit: number) =>
  limit === 5
    ? sortNotesByDate(
        await getCollection('notes', ({ data }) => data.draft !== true)
      )
        .slice(0, limit)
        .reduce((acc: Notes, n) => {
          const date = new Intl.DateTimeFormat('en-GB').format(n.data.date)
          if (!acc[date]) acc[date] = []
          acc[date].push(n)

          return acc
        }, {})
    : sortNotesByDate(
        await getCollection('notes', ({ data }) => data.draft !== true)
      ).reduce((acc: Notes, n) => {
        const date = new Intl.DateTimeFormat('en-GB').format(n.data.date)
        if (!acc[date]) acc[date] = []
        acc[date].push(n)

        return acc
      }, {})
