import { SOCIALS } from '@consts'

export type Social = {
  name: string
  url: string
}

export const getSocials = (): Social[] => [...SOCIALS]
