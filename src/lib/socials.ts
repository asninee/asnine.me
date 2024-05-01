import { z } from 'astro/zod'

const socialSchema = z.object({
  name: z.string(),
  link: z.string(),
})

export type Social = z.infer<typeof socialSchema>

export const getSocials = async (): Promise<Social[]> => [
  {
    name: 'github',
    link: 'https://github.com/asninee',
  },
  {
    name: 'linkedin',
    link: 'https://www.linkedin.com/in/asnine',
  },
  { name: 'email', link: 'mailto:asninee@pm.me' },
]
