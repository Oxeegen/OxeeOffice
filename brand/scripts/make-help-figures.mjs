#!/usr/bin/env node
// Regenerate the user manual's figures as OxeeOffice into brand/assets/help/.
//
//   node brand/scripts/make-help-figures.mjs
//
// Needs a built, renamed app with the brand assets applied (apply-brand-assets,
// the builds, rename-built-output), exactly as for a release. Windows or Linux.
//
// Upstream's figures show its own branding (logo, "Sign in", the Genspark panel
// header, an analytics switch, its GitHub link). Its generators drive the real
// app, so running them on our build gives OxeeOffice figures — after two edits
// made on a temporary copy, never on upstream's file: the seed folder and the
// sample PDF say OxeeOffice, and the output goes to brand/assets/help/. The four
// figures upstream captured by hand come from help-extra-figures.ts.
// apply-brand-assets.mjs then puts them over upstream's at build time.
import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../..', import.meta.url))
const OUT = join(ROOT, 'brand/assets/help')
// generator → its arguments: the two screen generators take languages, the CLI one figure names
const GENERATORS = { 'gen-help-screenshots': ['en'], 'gen-help-cli-figures': [], 'gen-help-shortcut-figure': ['en'] }
// optional: node make-help-figures.mjs <generator|extra> … runs only those
const ONLY = new Set(process.argv.slice(2))
const OUT_LINE = /const OUT_DIR = join\(REPO, 'apps\/shell\/src\/renderer\/src\/i18n\/help\/topics\/img'\)/

mkdirSync(OUT, { recursive: true })
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx'
const run = (args) => execFileSync(npx, args, { cwd: ROOT, stdio: 'inherit', shell: process.platform === 'win32' })

for (const [name, args] of Object.entries(GENERATORS)) {
  if (ONLY.size && !ONLY.has(name)) continue
  const src = readFileSync(join(ROOT, 'tools', `${name}.ts`), 'utf8')
  if (!OUT_LINE.test(src)) throw new Error(`${name}.ts: OUT_DIR line moved; update make-help-figures.mjs`)
  const patched = src
    .replace(OUT_LINE, `const OUT_DIR = ${JSON.stringify(OUT)}`)
    .replaceAll('GenOffice', 'OxeeOffice')
  const tmp = join(ROOT, 'tools', `.oxee-${name}.ts`)
  writeFileSync(tmp, patched)
  try {
    run(['tsx', tmp, ...args])
  } finally {
    rmSync(tmp, { force: true })
  }
}
if (!ONLY.size || ONLY.has('extra')) run(['tsx', join(ROOT, 'brand/scripts/help-extra-figures.ts'), OUT])
console.log(`make-help-figures: figures in ${OUT}`)
