import { describe, expect, it } from 'vitest'
import { getNotePublishedDate } from './note-date'

describe('getNotePublishedDate', () => {
  it('derives a date from a note filename', () => {
    expect(getNotePublishedDate('9-5-24')).toEqual(
      new Date('2024-05-09T00:00:00.000Z')
    )
  })

  it('ignores a same-day sequence suffix', () => {
    expect(getNotePublishedDate('9-5-24-2')).toEqual(
      new Date('2024-05-09T00:00:00.000Z')
    )
  })

  it.each(['2024-05-09', '32-1-24', '29-2-23'])('rejects %s', id => {
    expect(() => getNotePublishedDate(id)).toThrow('note filename')
  })
})
