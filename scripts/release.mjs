import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(
  process.env.RELEASE_PROJECT_ROOT ??
    fileURLToPath(new URL('..', import.meta.url))
)
const packagePath = join(projectRoot, 'package.json')
const changelogPath = join(projectRoot, 'src/content/blog/changelog.mdx')
const stableVersionPattern = /^\d+\.\d+\.\d+$/

const fail = message => {
  throw new Error(message)
}

const readPackage = () => JSON.parse(readFileSync(packagePath, 'utf8'))
const readChangelog = () => readFileSync(changelogPath, 'utf8')

const branchName = () => {
  if (process.env.RELEASE_BRANCH) return process.env.RELEASE_BRANCH

  return execFileSync('git', ['branch', '--show-current'], {
    cwd: projectRoot,
    encoding: 'utf8',
  }).trim()
}

const localDate = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const assertVersion = version => {
  if (!stableVersionPattern.test(version ?? '')) {
    fail('Release version must use stable x.y.z semantic versioning.')
  }
}

const compareVersions = (left, right) => {
  const leftParts = left.split('.').map(Number)
  const rightParts = right.split('.').map(Number)

  for (let index = 0; index < leftParts.length; index += 1) {
    if (leftParts[index] !== rightParts[index]) {
      return leftParts[index] - rightParts[index]
    }
  }

  return 0
}

const assertBranch = version => {
  const expected = `release/${version}`
  const actual = branchName()
  if (actual !== expected) fail(`Expected branch ${expected}, found ${actual}.`)
}

const topRelease = changelog => {
  const match = changelog.match(
    /<Version\s+name='([^']+)'\s+dateTime='([^']+)'(?:\s+href='[^']+')?\s*>/m
  )
  if (!match) fail('Changelog does not contain a release entry.')
  return { version: match[1], date: match[2], index: match.index }
}

const prepare = version => {
  assertVersion(version)
  assertBranch(version)

  const packageJson = readPackage()
  const changelog = readChangelog()
  const currentRelease = topRelease(changelog)
  const date =
    currentRelease.version === version ? currentRelease.date : localDate()

  if (packageJson.version !== currentRelease.version) {
    fail('Existing package and changelog versions are inconsistent.')
  }
  if (
    version !== packageJson.version &&
    compareVersions(version, packageJson.version) <= 0
  ) {
    fail(`Release version must be newer than ${packageJson.version}.`)
  }

  const updatedPattern = /^(updated:)\s*\d{4}-\d{2}-\d{2}$/m
  if (!updatedPattern.test(changelog)) {
    fail('Changelog frontmatter does not contain a valid updated date.')
  }
  let nextChangelog = changelog.replace(updatedPattern, `$1 ${date}`)

  if (currentRelease.version !== version) {
    const marker = '\n---\n\n<Version'
    const markerIndex = nextChangelog.indexOf(marker)
    if (markerIndex === -1)
      fail('Could not locate the first changelog release.')

    const release = `\n---\n\n<Version name='${version}' dateTime='${date}'>\n  <VersionItem type='patch'>TODO: summarize this release.</VersionItem>\n</Version>\n\n---\n`
    nextChangelog =
      nextChangelog.slice(0, markerIndex) +
      release +
      nextChangelog.slice(markerIndex + '\n---\n'.length)
  }

  packageJson.version = version
  writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`)
  writeFileSync(changelogPath, nextChangelog)
  console.log(`Prepared release ${version}. Replace any TODO changelog items.`)
}

const check = version => {
  assertVersion(version)
  assertBranch(version)

  const packageJson = readPackage()
  const changelog = readChangelog()
  const release = topRelease(changelog)
  const updated = changelog.match(/^updated:\s*(\d{4}-\d{2}-\d{2})$/m)?.[1]

  if (packageJson.version !== version) {
    fail(`package.json version is ${packageJson.version}; expected ${version}.`)
  }
  if (release.version !== version) {
    fail(`Newest changelog version is ${release.version}; expected ${version}.`)
  }
  if (updated !== release.date) {
    fail('Changelog updated date must match the newest release date.')
  }

  const remainingChangelog = changelog.slice(release.index + 1)
  const nextReleaseOffset = remainingChangelog.search(/\n<Version\b/)
  const nextReleaseIndex =
    nextReleaseOffset === -1 ? undefined : release.index + 1 + nextReleaseOffset
  const releaseBlock = changelog.slice(release.index, nextReleaseIndex)

  if (!/<VersionItem\s+type='(?:add|fix|patch|delete)'>/.test(releaseBlock)) {
    fail('Newest changelog release must contain at least one VersionItem.')
  }
  if (/\bTODO\b/i.test(releaseBlock)) {
    fail('Newest changelog release still contains a TODO.')
  }

  console.log(`Release ${version} metadata is consistent.`)
}

if (resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) {
  const [command, version] = process.argv.slice(2)

  try {
    if (command === 'prepare') prepare(version)
    else if (command === 'check') check(version)
    else fail('Usage: pnpm release:<prepare|check> <x.y.z>')
  } catch (error) {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  }
}
