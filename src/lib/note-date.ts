const noteIdPattern = /^(\d{1,2})-(\d{1,2})-(\d{2})(?:-\d+)?$/

export const getNotePublishedDate = (id: string) => {
  const match = noteIdPattern.exec(id)

  if (!match) {
    throw new Error(
      `Invalid note filename "${id}.mdx". Expected D-M-YY[-n].mdx.`
    )
  }

  const [, dayPart, monthPart, yearPart] = match
  const day = Number(dayPart)
  const month = Number(monthPart)
  const year = 2000 + Number(yearPart)
  const published = new Date(Date.UTC(year, month - 1, day))

  if (
    published.getUTCFullYear() !== year ||
    published.getUTCMonth() !== month - 1 ||
    published.getUTCDate() !== day
  ) {
    throw new Error(`Invalid date in note filename "${id}.mdx".`)
  }

  return published
}
