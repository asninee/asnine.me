import { getCollection, type CollectionEntry } from 'astro:content'
import { formatDate, sortNotesByDate } from './date'

export type Notes = {
  [date: string]: CollectionEntry<'notepad'>[]
}

const getPublishedNotes = () =>
  getCollection('notepad', ({ data }) => data.draft !== true)

export const getNotes = async (isHome: boolean) => {
  const notes = sortNotesByDate(await getPublishedNotes())
  const visibleNotes = isHome ? notes.slice(0, 2) : notes

  return visibleNotes.reduce((acc: Notes, note) => {
    const date = formatDate(note.data.published, true)
    if (!acc[date]) acc[date] = []
    acc[date].push(note)
    return acc
  }, {})
}

export const getNotesLength = async () => (await getPublishedNotes()).length
