import { generateOg } from '@lib/og'
import { getCollection, type CollectionEntry } from 'astro:content'

interface Props {
  params: { slug: string }
  props: { post: CollectionEntry<'blog'> }
}

export const GET = async ({ props }: Props) => {
  return new Response(await generateOg(props.post), {
    status: 200,
    headers: { 'Content-Type': 'image/png' },
  })
}

export const getStaticPaths = async () => {
  const posts = await getCollection('blog', ({ data }) => data.draft !== true)

  return posts.map(post => ({
    params: { id: post.id },
    props: { post },
  }))
}
