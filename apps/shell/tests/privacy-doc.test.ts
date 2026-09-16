import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { extractPackagedAnalyticsKeys } from '../src/main/analytics'

// OxeeOffice brand hook: upstream's test checks that PRIVACY.md lists every
// analytics event the shell emits. OxeeOffice's PRIVACY.md instead states
// that no usage analytics are sent, which holds because upstream's reporter
// only starts with injected GA4 credentials and OxeeOffice never injects
// them (brand/scripts/verify-package.mjs fails a package that carries them).
describe('PRIVACY.md analytics disclosure', () => {
  const privacy = readFileSync(join(__dirname, '../../../PRIVACY.md'), 'utf8')

  it('states that no usage analytics are sent, and lists no events', () => {
    expect(privacy).toMatch(/sends no usage analytics/)
    expect([...privacy.matchAll(/^- `([a-z][a-z0-9_]*)` —/gm)]).toHaveLength(0)
  })

  it('holds: without injected credentials the reporter never starts', () => {
    const pkg = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8')) as unknown
    expect(extractPackagedAnalyticsKeys(pkg, true)).toBeNull()
    expect(extractPackagedAnalyticsKeys({ productName: 'OxeeOffice', version: '0.10.488' }, true)).toBeNull()
  })
})
