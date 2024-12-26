import { SOCIALS } from '@consts'
import { z } from 'astro/zod'

const socialSchema = z.object({
  name: z.string(),
  url: z.string(),
})

export type Social = z.infer<typeof socialSchema>

export const getSocials = async (): Promise<Social[]> => [...SOCIALS]
