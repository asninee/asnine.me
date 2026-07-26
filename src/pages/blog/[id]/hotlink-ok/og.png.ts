import { generateOg } from '@lib/og'
import { getPosts } from '@lib/posts'
import type { APIRoute, GetStaticPaths } from 'astro'
import type { CollectionEntry } from 'astro:content'

type Props = { post: CollectionEntry<'blog'> }
type Params = { id: string }

export const GET: APIRoute<Props, Params> = async ({ props }) => {
  const image = await generateOg(props.post)

  return new Response(new Uint8Array(image), {
    headers: { 'Content-Type': 'image/png' },
  })
}

export const getStaticPaths = (async () => {
  const posts = await getPosts(false)

  return posts.map(post => ({
    params: { id: post.id },
    props: { post },
  }))
}) satisfies GetStaticPaths
