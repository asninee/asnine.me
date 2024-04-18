import { z } from 'astro/zod'

const projectSchema = z.object({
  repo: z.string(),
  link: z.string(),
  desc: z.string(),
  year: z.number(),
})

export type Project = z.infer<typeof projectSchema>

export const getProjects = async (): Promise<Project[]> => [
  {
    repo: 'asnine.me',
    link: 'https://github.com/nine96as/asnine.me',
    desc: 'This site',
    year: 2024,
  },
  {
    repo: 'codemaze_server',
    link: 'https://github.com/nine96as/codemaze_server',
    desc: 'Backend for the Codemaze application',
    year: 2024,
  },
  {
    repo: 'quizwiz_server',
    link: 'https://github.com/nine96as/quizwiz_server',
    desc: 'Backend for the QuizWiz application',
    year: 2023,
  },
  {
    repo: 'music_app',
    link: 'https://github.com/nine96as/music-app',
    desc: 'An artist viewing catalogue',
    year: 2023,
  },
  {
    repo: 'baloo-bot-final',
    link: 'https://github.com/nine96as/baloo-bot-final',
    desc: 'A multi-purpose Discord bot',
    year: 2023,
  },
]
