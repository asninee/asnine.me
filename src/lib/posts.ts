import { getCollection } from 'astro:content'
import { sortPostsByDate } from './date'

const getPublishedPosts = () =>
  getCollection('blog', ({ data }) => data.draft !== true)

export const getPosts = async (limit?: number) => {
  const posts = sortPostsByDate(await getPublishedPosts())
  return limit === undefined ? posts : posts.slice(0, limit)
}

export const getPostsLength = async () => (await getPublishedPosts()).length
