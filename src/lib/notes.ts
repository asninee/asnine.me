import { getCollection, type CollectionEntry } from 'astro:content'
import { sortNotesByDate } from './date'

export type Notes = {
  [date: string]: CollectionEntry<'notepad'>[]
}

export const getNotes = async (isHome: boolean) =>
  isHome
    ? (
        await sortNotesByDate(
          await getCollection('notepad', ({ data }) => data.draft !== true)
        )
      )
        .slice(0, 3)
        .reduce((acc: Notes, n) => {
          const date = new Intl.DateTimeFormat('en-GB').format(n.data.published)
          if (!acc[date]) acc[date] = []
          acc[date].push(n)

          return acc
        }, {})
    : (
        await sortNotesByDate(
          await getCollection('notepad', ({ data }) => data.draft !== true)
        )
      ).reduce((acc: Notes, n) => {
        const date = new Intl.DateTimeFormat('en-GB').format(n.data.published)
        if (!acc[date]) acc[date] = []
        acc[date].push(n)

        return acc
      }, {})
