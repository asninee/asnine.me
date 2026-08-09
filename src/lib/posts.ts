import { getCollection } from 'astro:content'
import { sortPostsByDate } from './date'

const getPublishedPosts = () =>
  getCollection('blog', ({ data }) => data.draft !== true)

export const getPosts = async (isHome: boolean) => {
  const posts = sortPostsByDate(await getPublishedPosts())
  return isHome ? posts.slice(0, 4) : posts
}

export const getPostsLength = async () => (await getPublishedPosts()).length
