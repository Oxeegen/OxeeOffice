#!/usr/bin/env node
// Licence guard for upstream's ee/ directory.
//
// Everything under ee/ is under the "GenOffice Enterprise License", NOT
// Apache-2.0: development and testing only, no distribution. Upstream keeps it
// empty today (LICENSE + README.md). If code ever lands there, OxeeOffice must
// not ship it — this fails the build so a human decides, rather than an
// installer quietly redistributing licence-restricted code.
//
// Also checks that nothing in the built apps imports from ee/.

import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../..', import.meta.url))
const ALLOWED = new Set(['LICENSE', 'README.md'])

const problems = []
let entries = []
try { entries = readdirSync(join(ROOT, 'ee')) } catch { /* no ee/ at all: fine */ }
for (const e of entries) if (!ALLOWED.has(e)) problems.push(`ee/${e}`)

// any bundle or package.json referencing the ee tree
const refs = /["'`](?:\.\.\/)+ee\/|["'`]@genoffice\/ee\b/
for (const dir of ['apps', 'packages']) {
  for (const name of readdirSync(join(ROOT, dir))) {
    const pkg = join(ROOT, dir, name, 'package.json')
    try { if (refs.test(readFileSync(pkg, 'utf8'))) problems.push(`${dir}/${name}/package.json references ee/`) } catch {}
  }
}

if (problems.length) {
  console.error('check-ee: enterprise-licensed code present — OxeeOffice must not distribute it:')
  for (const p of problems) console.error('  ' + p)
  console.error('See ee/LICENSE. Exclude it from the build or get an agreement before releasing.')
  process.exit(1)
}
console.log(`check-ee: ok (ee/ holds only ${[...ALLOWED].join(', ')})`)
