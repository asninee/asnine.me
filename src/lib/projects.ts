import { PROJECTS } from '@consts'
import { z } from 'astro/zod'

const projectSchema = z.object({
  name: z.string(),
  url: z.string(),
  desc: z.string(),
  year: z.number(),
})

export type Project = z.infer<typeof projectSchema>

export const getProjects = async (): Promise<Project[]> => [...PROJECTS]
