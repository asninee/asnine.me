import { describe, expect, it } from 'vitest'
import {
  getDeploymentUrl,
  recordDeploymentUrl,
} from './record-deployment-snapshot.mjs'

const snapshotUrl = 'https://65660821.asnine-me.pages.dev/'

const version = (attributes = "name='2.0.1' date='09/08/26'") => `---

<Version ${attributes}>
  <VersionItem type='fix'>Fix something.</VersionItem>
</Version>
`

describe('deployment snapshot helpers', () => {
  it('extracts the project snapshot URL from Cloudflare check output', () => {
    const summary = `<a href='https://dash.cloudflare.com/example'>Logs</a>
<a href='${snapshotUrl}'>${snapshotUrl}</a>`

    expect(getDeploymentUrl(summary)).toBe(snapshotUrl)
  })

  it.each([
    undefined,
    'https://example.com',
    'http://65660821.asnine-me.pages.dev',
    'https://asnine-me.pages.dev.evil.example',
  ])('rejects check output without a project snapshot URL', summary => {
    expect(() => getDeploymentUrl(summary)).toThrow(
      'Cloudflare check output does not contain a valid snapshot URL.'
    )
  })

  it('adds the snapshot to the latest version', () => {
    expect(recordDeploymentUrl(version(), snapshotUrl)).toContain(
      `date='09/08/26' href='${snapshotUrl}'>`
    )
  })

  it('does nothing when the latest version is already linked', () => {
    const changelog = `${version(
      `name='2.0.1' date='09/08/26' href='${snapshotUrl}'`
    )}\n${version("name='2.0.0' date='26/07/26'")}`

    expect(recordDeploymentUrl(changelog, snapshotUrl)).toBe(changelog)
  })

  it('does not backfill an older unlinked version', () => {
    const changelog = `${version(
      `name='2.0.1' date='09/08/26' href='${snapshotUrl}'`
    )}\n${version("name='2.0.0' date='26/07/26'")}`

    expect(recordDeploymentUrl(changelog, snapshotUrl)).not.toContain(
      `date='26/07/26' href=`
    )
  })

  it('rejects invalid deployment URLs and changelogs without versions', () => {
    expect(() => recordDeploymentUrl(version(), 'https://example.com')).toThrow(
      'Deployment URL must belong to the asnine-me Pages project.'
    )
    expect(() => recordDeploymentUrl('No releases yet.', snapshotUrl)).toThrow(
      'Changelog does not contain a version.'
    )
  })
})
