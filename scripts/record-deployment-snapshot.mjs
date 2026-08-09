import { readFile, writeFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'

const changelogPath = 'src/content/blog/changelog.mdx'
const snapshotHostnameSuffix = '.asnine-me.pages.dev'

export function getDeploymentUrl(summary) {
  const links = summary?.match(/https:\/\/[^\s"'<>()[\]]+/g) ?? []

  for (const link of links) {
    const url = new URL(link)
    if (url.hostname.endsWith(snapshotHostnameSuffix)) return url.href
  }

  throw new Error(
    'Cloudflare check output does not contain a valid snapshot URL.'
  )
}

export function recordDeploymentUrl(changelog, deploymentUrl) {
  const url = new URL(deploymentUrl)
  if (
    url.protocol !== 'https:' ||
    !url.hostname.endsWith(snapshotHostnameSuffix)
  ) {
    throw new Error(
      'Deployment URL must belong to the asnine-me Pages project.'
    )
  }

  const versionTag = /<Version\b[^>]*>/
  const match = changelog.match(versionTag)

  if (!match) throw new Error('Changelog does not contain a version.')
  if (/\bhref=/.test(match[0])) return changelog

  return changelog.replace(
    versionTag,
    `${match[0].slice(0, -1)} href='${url.href}'>`
  )
}

async function main() {
  const chunks = []
  for await (const chunk of process.stdin) chunks.push(chunk)

  const checkRun = JSON.parse(Buffer.concat(chunks).toString('utf8'))
  const deploymentUrl = getDeploymentUrl(checkRun.output?.summary)
  const changelog = await readFile(changelogPath, 'utf8')
  const updatedChangelog = recordDeploymentUrl(changelog, deploymentUrl)

  if (updatedChangelog === changelog) {
    console.log('Latest changelog version already has a deployment snapshot.')
    return
  }

  await writeFile(changelogPath, updatedChangelog)
  console.log(`Recorded deployment snapshot: ${deploymentUrl}`)
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main()
