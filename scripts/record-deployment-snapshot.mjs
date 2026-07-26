import { readFile, writeFile } from 'node:fs/promises'

const changelogPath = 'src/content/blog/changelog.mdx'
const deploymentUrl = process.env.DEPLOYMENT_URL

if (!deploymentUrl) throw new Error('DEPLOYMENT_URL is required.')

const url = new URL(deploymentUrl)
if (url.protocol !== 'https:' || !url.hostname.endsWith('.pages.dev')) {
  throw new Error('DEPLOYMENT_URL must be an HTTPS Cloudflare Pages URL.')
}

const changelog = await readFile(changelogPath, 'utf8')
const versionTag = /<Version\b(?![^>]*\bhref=)[^>]*>/
const match = changelog.match(versionTag)

if (!match) {
  console.log('No changelog version requires a deployment snapshot.')
  process.exit(0)
}

const updatedChangelog = changelog.replace(
  versionTag,
  `${match[0].slice(0, -1)} href='${url.href}'>`
)

await writeFile(changelogPath, updatedChangelog)
console.log(`Recorded deployment snapshot: ${url.href}`)
