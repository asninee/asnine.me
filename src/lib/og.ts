import favicon from '../assets/og/favicon.png?inline'
import font from '../assets/og/OpeningHoursSans.otf?inline'
import type { CollectionEntry } from 'astro:content'
import satori from 'satori'
import { html } from 'satori-html'
import sharp from 'sharp'

const fontData = Buffer.from(font.split(',')[1], 'base64')

const getMarkup = async (post: CollectionEntry<'blog'>) =>
  html`<div
    tw="relative flex flex-col h-[100%] w-[100%] py-14 px-[70px] bg-neutral-900 lowercase text-neutral-300 text-6xl"
  >
    <div tw="flex items-center" style="gap: 20px">
      <img style="width: 50px; height: 50px" src="${favicon}" />
      <span tw="text-4xl">asnine.me</span>
    </div>
    <div tw="flex flex-col mt-24" style="gap: 40px">
      <span>${post.data.title}</span>
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
        data: fontData,
        weight: 400,
        style: 'normal',
      },
    ],
  })

  return sharp(Buffer.from(svg))
    .png({ compressionLevel: 9, palette: true })
    .toBuffer()
}
