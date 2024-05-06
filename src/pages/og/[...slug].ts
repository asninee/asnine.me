import { OGImageRoute } from 'astro-og-canvas'
import { getCollection } from 'astro:content'

const entries = await getCollection('blog')

// map the array of content collection entries to create an object
const pages = Object.fromEntries(
  entries.map(({ slug, data }) => [slug, { data }])
)

export const { getStaticPaths, GET } = OGImageRoute({
  param: 'slug',
  pages,

  getImageOptions: (_path, page) => ({
    title: page.data.title,
    description: page.data.desc,
  }),
})
