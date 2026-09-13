import { execFileSync } from 'node:child_process'
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'

const script = new URL('./content.mjs', import.meta.url)
const temporaryDirectories = []

const createProject = ({ git = false } = {}) => {
  const root = mkdtempSync(join(tmpdir(), 'asnine-content-'))
  temporaryDirectories.push(root)
  mkdirSync(join(root, 'src/content/blog'), { recursive: true })
  mkdirSync(join(root, 'src/content/notepad'), { recursive: true })

  if (git) {
    execFileSync('git', ['init', '--quiet'], { cwd: root })
    execFileSync('git', ['config', 'user.name', 'Test'], { cwd: root })
    execFileSync('git', ['config', 'user.email', 'test@example.com'], {
      cwd: root,
    })
    execFileSync('git', ['config', 'commit.gpgSign', 'false'], { cwd: root })
  }

  return root
}

const runContent = (root, ...args) =>
  execFileSync(process.execPath, [script.pathname, ...args], {
    cwd: root,
    env: { ...process.env, CONTENT_PROJECT_ROOT: root },
    encoding: 'utf8',
  })

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true })
  }
})

describe('content commands', () => {
  it('creates a dated draft post', () => {
    const root = createProject()
    runContent(root, 'new-post', 'hello-world')

    const post = readFileSync(
      join(root, 'src/content/blog/hello-world.mdx'),
      'utf8'
    )
    expect(post).toMatch(
      /^---\ndraft: true\ntitle: 'hello world'\npublished: \d{4}-\d{2}-\d{2}\ndesc: 'TODO'\n---\n$/
    )
  })

  it('creates uniquely named notes without date frontmatter', () => {
    const root = createProject()
    runContent(root, 'new-note')
    runContent(root, 'new-note')

    const notes = readdirSync(join(root, 'src/content/notepad')).toSorted()

    expect(notes).toHaveLength(2)
    expect(notes).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/^\d{1,2}-\d{1,2}-\d{2}\.mdx$/),
        expect.stringMatching(/^\d{1,2}-\d{1,2}-\d{2}-2\.mdx$/),
      ])
    )
    const firstNote = notes.find(note => !note.endsWith('-2.mdx'))
    expect(
      readFileSync(join(root, 'src/content/notepad', firstNote), 'utf8')
    ).toBe('---\ndraft: true\n---\n')
  })

  it('updates only the date when a post is partially staged', () => {
    const root = createProject({ git: true })
    const relativePath = 'src/content/blog/example.mdx'
    const path = join(root, relativePath)
    const original = `---\ntitle: 'example'\npublished: 2024-01-01\ndesc: 'example'\n---\n\nOriginal.\n`
    const staged = original.replace('Original.', 'Staged.')

    writeFileSync(path, original)
    execFileSync('git', ['add', relativePath], { cwd: root })
    execFileSync('git', ['commit', '--quiet', '-m', 'initial'], { cwd: root })
    writeFileSync(path, staged)
    execFileSync('git', ['add', relativePath], { cwd: root })
    writeFileSync(path, `${staged}\nUnstaged.\n`)

    runContent(root, 'update-post-dates', '--staged')

    const stagedAfter = execFileSync('git', ['show', `:${relativePath}`], {
      cwd: root,
      encoding: 'utf8',
    })
    const workingAfter = readFileSync(path, 'utf8')

    expect(stagedAfter).toMatch(/^updated: \d{4}-\d{2}-\d{2}$/m)
    expect(stagedAfter).toContain('Staged.')
    expect(stagedAfter).not.toContain('Unstaged.')
    expect(workingAfter).toMatch(/^updated: \d{4}-\d{2}-\d{2}$/m)
    expect(workingAfter).toContain('Unstaged.')
  })
})
