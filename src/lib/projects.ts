import { PROJECTS } from '@consts'

export type Project = {
  name: string
  url: string
  desc: string
  year: number
}

export const getProjects = (): Project[] => [...PROJECTS]
