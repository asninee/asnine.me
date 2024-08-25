import type { CollectionEntry } from 'astro:content'
import { readFile } from 'node:fs/promises'
import satori from 'satori'
import { html } from 'satori-html'
import sharp from 'sharp'

export const getMarkup = async (post: CollectionEntry<'blog'>) =>
  html`<div
    style="font-family: BDOGrotesk"
    tw="relative flex flex-col h-[100%] w-[100%] py-14 px-[70px] bg-neutral-900 lowercase text-neutral-300 text-6xl"
  >
    <div tw="flex flex-col absolute border-l-2 border"></div>
    <div tw="flex items-center" style="gap: 15px">
      <img
        width="50"
        height="50"
        src="data:image/png;base64,${(
          await readFile('./public/favicon.png')
        ).toString('base64')}"
      />
      <span tw="text-4xl">asnine.me</span>
    </div>
    <div tw="flex flex-col mt-24" style="gap: 40px">
      <span tw="font-bold">${post.data.title}</span>
      <span tw="text-neutral-400 text-4xl">${post.data.desc}</span>
    </div>
  </div>`

export const generateOg = async (
  post: CollectionEntry<'blog'>
): Promise<Buffer> => {
  const svg = await satori(await getMarkup(post), {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'OpeningHoursSans',
        data: await readFile('public/fonts/OpeningHoursSans.otf'),
        weight: 400,
        style: 'normal',
      },
    ],
  })

  return await sharp(Buffer.from(svg)).png().toBuffer()
}
