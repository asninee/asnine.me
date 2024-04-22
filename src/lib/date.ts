import type { CollectionEntry } from 'astro:content'

export const sortPostsByDate = (posts: CollectionEntry<'blog'>[]) =>
  posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
