import { getCollection, type CollectionEntry } from 'astro:content'
import { formatDate, sortNotesByDate } from './date'

export type Notes = {
  [date: string]: CollectionEntry<'notepad'>[]
}

const getPublishedNotes = () =>
  getCollection('notepad', ({ data }) => data.draft !== true)

export const getNotes = async (limit?: number) => {
  const notes = sortNotesByDate(await getPublishedNotes())
  const visibleNotes = limit === undefined ? notes : notes.slice(0, limit)

  return visibleNotes.reduce((acc: Notes, note) => {
    const date = formatDate(note.data.published, 'withYear')
    if (!acc[date]) acc[date] = []
    acc[date].push(note)
    return acc
  }, {})
}

export const getNotesLength = async () => (await getPublishedNotes()).length
