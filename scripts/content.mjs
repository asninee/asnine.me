import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(
  process.env.CONTENT_PROJECT_ROOT ??
    fileURLToPath(new URL('..', import.meta.url))
)
const blogDirectory = join(projectRoot, 'src/content/blog')
const noteDirectory = join(projectRoot, 'src/content/notepad')

const runGit = (args, options = {}) =>
  execFileSync('git', args, {
    cwd: projectRoot,
    encoding: 'utf8',
    ...options,
  })

const localDate = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const noteDate = () => {
  const now = new Date()
  return `${now.getDate()}-${now.getMonth() + 1}-${String(now.getFullYear()).slice(-2)}`
}

const createPost = slug => {
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error('Usage: pnpm new:post <lowercase-kebab-case-slug>')
  }

  const path = join(blogDirectory, `${slug}.mdx`)
  const title = slug.replaceAll('-', ' ')
  const content = `---\ndraft: true\ntitle: '${title}'\npublished: ${localDate()}\ndesc: 'TODO'\n---\n`

  writeFileSync(path, content, { flag: 'wx' })
  console.log(`Created ${relative(projectRoot, path)}`)
}

const createNote = () => {
  const stem = noteDate()
  let sequence = 1
  let path = join(noteDirectory, `${stem}.mdx`)

  while (existsSync(path)) {
    sequence += 1
    path = join(noteDirectory, `${stem}-${sequence}.mdx`)
  }

  writeFileSync(path, '---\ndraft: true\n---\n', { flag: 'wx' })
  console.log(`Created ${relative(projectRoot, path)}`)
}

const withoutUpdatedDate = content => {
  const end = content.indexOf('\n---', 4)
  if (!content.startsWith('---\n') || end === -1) return content

  const frontmatter = content.slice(0, end)
  return (
    frontmatter.replace(/^updated:[^\n]*(?:\n|$)/m, '') + content.slice(end)
  )
}

const withUpdatedDate = (content, date) => {
  const end = content.indexOf('\n---', 4)
  if (!content.startsWith('---\n') || end === -1) return content

  const frontmatter = content.slice(0, end)
  const rest = content.slice(end)

  if (/^updated:/m.test(frontmatter)) {
    return frontmatter.replace(/^updated:[^\n]*$/m, `updated: ${date}`) + rest
  }

  if (!/^published:/m.test(frontmatter)) {
    throw new Error('Blog post frontmatter is missing a published date.')
  }

  return (
    frontmatter.replace(/^(published:[^\n]*)$/m, `$1\nupdated: ${date}`) + rest
  )
}

const stagedPostChanges = () => {
  const output = runGit([
    'diff',
    '--cached',
    '--name-status',
    '-z',
    '--diff-filter=MR',
    '--',
    'src/content/blog',
  ])
  const parts = output.split('\0').filter(Boolean)
  const changes = []

  for (let index = 0; index < parts.length;) {
    const status = parts[index++]

    if (status.startsWith('R')) {
      changes.push({ previousPath: parts[index++], path: parts[index++] })
    } else {
      const path = parts[index++]
      changes.push({ previousPath: path, path })
    }
  }

  return changes.filter(({ path }) => path.endsWith('.mdx'))
}

const updateIndexFile = (path, content) => {
  const stagedEntry = runGit(['ls-files', '--stage', '--', path]).trim()
  const mode = stagedEntry.split(' ', 1)[0]
  const object = runGit(['hash-object', '-w', '--stdin'], {
    input: content,
  }).trim()
  runGit(['update-index', '--cacheinfo', `${mode},${object},${path}`])
}

const updatePostDates = () => {
  const date = localDate()
  const updated = []

  for (const { previousPath, path } of stagedPostChanges()) {
    const previous = runGit(['show', `HEAD:${previousPath}`])
    const staged = runGit(['show', `:${path}`])

    if (withoutUpdatedDate(previous) === withoutUpdatedDate(staged)) continue

    const nextStaged = withUpdatedDate(staged, date)
    if (nextStaged === staged) continue

    updateIndexFile(path, nextStaged)

    const workingPath = join(projectRoot, path)
    if (existsSync(workingPath)) {
      const working = readFileSync(workingPath, 'utf8')
      const nextWorking = withUpdatedDate(working, date)
      if (nextWorking !== working) writeFileSync(workingPath, nextWorking)
    }

    updated.push(basename(path))
  }

  if (updated.length > 0) {
    console.log(`Updated post dates: ${updated.join(', ')}`)
  }
}

const installHooks = () => {
  if (process.env.CI) return

  const repository = spawnSync('git', ['rev-parse', '--git-dir'], {
    cwd: projectRoot,
    stdio: 'ignore',
  })
  if (repository.status !== 0) return

  const configured = spawnSync('git', ['config', '--get', 'core.hooksPath'], {
    cwd: projectRoot,
    encoding: 'utf8',
  }).stdout.trim()

  if (configured && configured !== '.githooks') {
    console.warn(`Keeping existing Git hooks path: ${configured}`)
    return
  }

  runGit(['config', 'core.hooksPath', '.githooks'])
}

if (resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) {
  const [command, argument] = process.argv.slice(2)

  try {
    if (command === 'new-post') createPost(argument)
    else if (command === 'new-note') createNote()
    else if (command === 'update-post-dates') updatePostDates()
    else if (command === 'install-hooks') installHooks()
    else throw new Error(`Unknown content command: ${command ?? '(none)'}`)
  } catch (error) {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  }
}
