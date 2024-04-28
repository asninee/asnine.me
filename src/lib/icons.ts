import { z } from 'astro/zod'

const iconSchema = z.object({
  name: z.string(),
  icon: z.string(),
})

export type Icon = z.infer<typeof iconSchema>

export const getIcons = async (): Promise<Icon[]> => [
  {
    name: 'github',
    icon: 'mdi:github',
  },
  {
    name: 'linkedin',
    icon: 'mdi:linkedin',
  },
]
