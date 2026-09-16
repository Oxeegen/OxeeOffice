#!/usr/bin/env node
// Verify every OxeeOffice hook in upstream files is still in place.
//
//   node brand/scripts/check-hooks.mjs
//
// A merge that resolves a conflict in upstream's favour does not fail to
// compile — it silently ships upstream behaviour again (the pre-fork patch
// pipeline shipped broken builds twice that way). This makes a lost hook a
// red CI run instead. Every hook is listed in brand/README.md; keep the two
// in step.

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../..', import.meta.url))
const brand = JSON.parse(readFileSync(join(ROOT, 'brand/config/brand.config.json'), 'utf8'))
const REPO = `${brand.publish.owner}/${brand.publish.repo}`
const UPSTREAM = brand.upstream.repo

/** Each hook: file, strings it must contain, strings it must not. */
const HOOKS = [
  {
    file: 'apps/shell/src/renderer/src/main.tsx',
    why: 'brand stylesheet imported after upstream CSS',
    must: ["import '../../../../../brand/theme/shell.css'"],
  },
  {
    file: 'packages/electron-utils/src/github-menu.ts',
    why: 'Help menu / star CTA repository',
    must: [`GITHUB_REPO_URL = 'https://github.com/${REPO}'`],
  },
  {
    file: 'apps/shell/src/main/index.ts',
    why: 'About page star count',
    must: [`'https://api.github.com/repos/${REPO}'`],
  },
  {
    file: 'apps/shell/src/main/updater.ts',
    why: 'manual download page + stable-only feed',
    must: [
      `DOWNLOAD_PAGE_URL = 'https://github.com/${REPO}/releases/latest'`,
      "{ stable: 'latest', beta: 'latest' }",
    ],
  },
  {
    file: 'apps/shell/src/renderer/src/SettingsModal.tsx',
    why: 'About page repository label',
    must: [`'github.com/${REPO}'`, `\`github.com/${REPO} · ★`],
  },
  {
    file: 'apps/shell/src/renderer/src/IntegrationsPane.tsx',
    why: 'agent skill install source',
    must: [`'npx skills add ${REPO}'`],
  },
  {
    file: 'SECURITY.md',
    why: 'vulnerability reports go to the fork',
    must: [`https://github.com/${REPO}/security/advisories/new`],
  },
  {
    file: '.github/workflows/ci.yml',
    why: "upstream's CI runs in the fork only on demand",
    must: ["if: github.repository == 'genspark-ai/genoffice' || github.event_name == 'workflow_dispatch'"],
  },
  // upstream tests updated to assert what ships
  {
    file: 'apps/shell/tests/updater.test.ts',
    why: 'tests follow the updater hooks',
    must: [`'https://github.com/${REPO}/releases/latest'`],
  },
  {
    file: 'apps/shell/tests/settings-integrations.test.ts',
    why: 'test follows the skill-install hook',
    must: [`'npx skills add ${REPO}'`],
  },
]

const problems = []
for (const h of HOOKS) {
  let text
  try {
    text = readFileSync(join(ROOT, h.file), 'utf8')
  } catch {
    problems.push(`${h.file}: file missing (${h.why})`)
    continue
  }
  for (const s of h.must) if (!text.includes(s)) problems.push(`${h.file}: lost hook (${h.why}) — expected ${s}`)
}

// New upstream references to its own repository inside string literals of
// shipped source. Comments (issue links like genspark-ai/genoffice#135) are fine.
const literalRef = new RegExp(`['"\`][^'"\`\\n]*${UPSTREAM.replace('/', '\\/')}`)
function* sources(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === 'out' || e.name === 'dist' || e.name === 'tests' || e.name === '__tests__') continue
    const p = join(dir, e.name)
    if (e.isDirectory()) yield* sources(p)
    else if (/\.(ts|tsx)$/.test(e.name) && !/\.(test|spec)\.tsx?$/.test(e.name)) yield p
  }
}
for (const top of ['apps', 'packages']) {
  for (const p of sources(join(ROOT, top))) {
    const lines = readFileSync(p, 'utf8').split('\n')
    lines.forEach((line, i) => {
      const code = line.replace(/\/\/.*$/, '')
      if (literalRef.test(code)) problems.push(`${relative(ROOT, p).split(sep).join('/')}:${i + 1}: new reference to ${UPSTREAM}`)
    })
  }
}

if (problems.length) {
  console.error('check-hooks: brand hooks missing or new upstream references:')
  for (const p of problems) console.error('  ' + p)
  console.error('Re-apply the hook (brand/README.md lists each one) or add a new one.')
  process.exit(1)
}
console.log(`check-hooks: ok (${HOOKS.length} hooks, no stray ${UPSTREAM} references)`)
