import { getCollection } from 'astro:content'
import { sortPostsByDate } from './date'

export const getBlogCollection = async () => {
  const posts = sortPostsByDate(
    await getCollection('blog', ({ data }) => data.isDraft !== true)
  )

  return posts.map(p => ({
    ...p,
    data: {
      ...p.data,
      ogImage: `https://asnine.me/og/blog/${p.slug}.png`,
    },
  }))
}
