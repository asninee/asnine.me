import { getMarkup } from '@/lib/og'
import { getCollection, type CollectionEntry } from 'astro:content'
import { readFile } from 'node:fs/promises'
import satori from 'satori'
import sharp from 'sharp'

interface Props {
  params: { slug: string }
  props: { post: CollectionEntry<'blog'> }
}

export const GET = async ({ props }: Props) => {
  const svg = await satori(await getMarkup(props), {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'Newsreader',
        data: await readFile('public/fonts/Newsreader400.ttf'),
        weight: 400,
        style: 'italic',
      },
      {
        name: 'BDOGrotesk',
        data: await readFile('public/fonts/BDOGrotesk400.ttf'),
        weight: 400,
        style: 'normal',
      },
      {
        name: 'BDOGrotesk',
        data: await readFile('public/fonts/BDOGrotesk600.ttf'),
        weight: 600,
        style: 'normal',
      },
    ],
  })

  const png = await sharp(Buffer.from(svg)).png().toBuffer()

  return new Response(png, {
    status: 200,
    headers: { 'Content-Type': 'image/png' },
  })
}

export const getStaticPaths = async () => {
  const posts = await getCollection('blog', ({ data }) => data.draft !== true)

  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post },
  }))
}
