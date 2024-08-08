import { getCollection } from 'astro:content'
import { sortPostsByDate } from './date'

export const getPosts = async (isHome: boolean) =>
  isHome
    ? (
        await sortPostsByDate(
          await getCollection('blog', ({ data }) => data.draft !== true)
        )
      ).slice(0, 4)
    : await sortPostsByDate(
        await getCollection('blog', ({ data }) => data.draft !== true)
      )
