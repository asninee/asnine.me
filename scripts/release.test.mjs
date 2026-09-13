import { execFileSync, spawnSync } from 'node:child_process'
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'

const script = new URL('./release.mjs', import.meta.url)
const temporaryDirectories = []

const createProject = () => {
  const root = mkdtempSync(join(tmpdir(), 'asnine-release-'))
  temporaryDirectories.push(root)
  mkdirSync(join(root, 'src/content/blog'), { recursive: true })
  writeFileSync(
    join(root, 'package.json'),
    `${JSON.stringify({ version: '1.2.3' }, null, 2)}\n`
  )
  writeFileSync(
    join(root, 'src/content/blog/changelog.mdx'),
    `---\ntitle: 'changelog'\npublished: 2024-01-01\nupdated: 2024-01-01\ndesc: 'changes'\n---\n\nIntro.\n\n---\n\n<Version name='1.2.3' dateTime='2024-01-01'>\n  <VersionItem type='patch'>Previous release.</VersionItem>\n</Version>\n`
  )
  execFileSync(
    'git',
    ['init', '--quiet', '--initial-branch', 'release/1.2.4'],
    {
      cwd: root,
    }
  )
  return root
}

const runRelease = (root, ...args) =>
  spawnSync(process.execPath, [script.pathname, ...args], {
    cwd: root,
    env: { ...process.env, RELEASE_PROJECT_ROOT: root },
    encoding: 'utf8',
  })

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true })
  }
})

describe('release commands', () => {
  it('prepares matching package and changelog versions', () => {
    const root = createProject()
    const result = runRelease(root, 'prepare', '1.2.4')
    const packageJson = JSON.parse(
      readFileSync(join(root, 'package.json'), 'utf8')
    )
    const changelog = readFileSync(
      join(root, 'src/content/blog/changelog.mdx'),
      'utf8'
    )

    expect(result.status).toBe(0)
    expect(packageJson.version).toBe('1.2.4')
    expect(changelog).toContain("<Version name='1.2.4'")
    expect(changelog).toContain('TODO: summarize this release.')
    expect(changelog).toContain("<Version name='1.2.3'")
    expect(changelog).toMatch(/<\/Version>\n\n---\n\n<Version name='1\.2\.3'/)
  })

  it('accepts complete, consistent release metadata', () => {
    const root = createProject()
    runRelease(root, 'prepare', '1.2.4')
    const changelogPath = join(root, 'src/content/blog/changelog.mdx')
    const changelog = readFileSync(changelogPath, 'utf8').replace(
      'TODO: summarize this release.',
      'Add the release workflow.'
    )
    writeFileSync(changelogPath, changelog)

    const result = runRelease(root, 'check', '1.2.4')

    expect(result.status).toBe(0)
    expect(result.stdout).toContain('Release 1.2.4 metadata is consistent.')
  })

  it('rejects incomplete changelog prose', () => {
    const root = createProject()
    runRelease(root, 'prepare', '1.2.4')

    const result = runRelease(root, 'check', '1.2.4')

    expect(result.status).toBe(1)
    expect(result.stderr).toContain('still contains a TODO')
  })

  it('rejects a mismatched branch', () => {
    const root = createProject()
    const result = runRelease(root, 'check', '2.0.0')

    expect(result.status).toBe(1)
    expect(result.stderr).toContain('Expected branch release/2.0.0')
  })
})
