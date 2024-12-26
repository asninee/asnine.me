import { getCollection, type CollectionEntry } from 'astro:content'
import { formatDate, sortNotesByDate } from './date'

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
        .slice(0, 2)
        .reduce((acc: Notes, n) => {
          const date = formatDate(n.data.published, true)
          if (!acc[date]) acc[date] = []
          acc[date].push(n)

          return acc
        }, {})
    : (
        await sortNotesByDate(
          await getCollection('notepad', ({ data }) => data.draft !== true)
        )
      ).reduce((acc: Notes, n) => {
        const date = formatDate(n.data.published, true)
        if (!acc[date]) acc[date] = []
        acc[date].push(n)

        return acc
      }, {})

export const getNotesLength = async () =>
  (await getCollection('notepad', ({ data }) => data.draft !== true)).length
