import { describe, expect, it } from 'vitest'
import { formatDate, sortNotesByDate, sortPostsByDate } from './date'

type Post = Parameters<typeof sortPostsByDate>[0][number]
type Note = Parameters<typeof sortNotesByDate>[0][number]

const post = (published: string, updated?: string) =>
  ({
    data: {
      published: new Date(published),
      updated: updated ? new Date(updated) : undefined,
    },
  }) as Post

const note = (published: string) =>
  ({ data: { published: new Date(published) } }) as Note

describe('date helpers', () => {
  it('sorts posts by their latest effective date without mutating input', () => {
    const older = post('2025-01-01')
    const updated = post('2024-01-01', '2025-03-01')
    const newer = post('2025-02-01')
    const posts = [older, updated, newer]

    expect(sortPostsByDate(posts)).toEqual([updated, newer, older])
    expect(posts).toEqual([older, updated, newer])
  })

  it('sorts notes by published date without mutating input', () => {
    const older = note('2025-01-01')
    const newer = note('2025-02-01')
    const notes = [older, newer]

    expect(sortNotesByDate(notes)).toEqual([newer, older])
    expect(notes).toEqual([older, newer])
  })

  it('formats dates for list and detail contexts', () => {
    const date = new Date(2026, 0, 2)

    expect(formatDate(date, true)).toBe('02/01/26')
    expect(formatDate(date, false)).toBe('02/01')
  })
})
