import type { CollectionEntry } from 'astro:content'
import { readFileSync } from 'node:fs'
import { html } from 'satori-html'

interface Props {
  post: CollectionEntry<'blog'>
}

const favicon = readFileSync('./public/favicon.png')

export const getMarkup = ({ post }: Props) =>
  html`<div
    style="font-family: AG57"
    tw="flex flex-col h-[100%] w-[100%] py-14 px-[70px] bg-neutral-900 lowercase text-gray-300 text-7xl"
  >
    <div tw="flex items-center" style="gap: 40px">
      <img
        width="100"
        height="100"
        src="data:image/png;base64,${favicon.toString('base64')}"
      />
      <div style="font-family: Newsreader">asnine.me</div>
    </div>
    <div tw="flex flex-col mt-24 text-6xl" style="gap: 40px">
      <span tw="font-bold">${post.data.title}</span>
      <span tw="text-neutral-400 text-5xl">${post.data.desc}</span>
    </div>
  </div>`
