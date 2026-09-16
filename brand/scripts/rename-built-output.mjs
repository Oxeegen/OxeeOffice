#!/usr/bin/env node
// Rewrite user-visible upstream product names in the BUILT apps, in place.
//
//   node brand/scripts/rename-built-output.mjs
//
// Runs after `build:all` and before electron-builder packs (the brand
// electron-builder config calls it from beforePack, and the release workflow
// runs it explicitly). Idempotent: a second run changes nothing.
//
// Upstream source is never touched, so upstream's unit tests keep asserting
// upstream's strings and merges stay mechanical. What ships is what this
// rewrites; brand/scripts/scan-visible-names.mjs --fail then proves nothing
// visible was missed.
//
//   JS    string literals and template chunks only (see rename/core.mjs)
//   HTML  text outside <!-- comments -->
//   CSS   left alone: only comments and @font-face aliases carry the names

import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { join, relative, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { rewriteJs, applyRules, collectFontAliases, protectFontAliases } from '../rename/core.mjs'
import { BUILT_ROOTS, ALLOWLIST } from '../rename/roots.mjs'

const ROOT = fileURLToPath(new URL('../..', import.meta.url))

function* files(p) {
  let st
  try { st = statSync(p) } catch { return }
  if (st.isFile()) { yield p; return }
  for (const e of readdirSync(p, { withFileTypes: true })) {
    const c = join(p, e.name)
    if (e.isDirectory()) yield* files(c)
    else yield c
  }
}
const rel = (p) => relative(ROOT, p).replace(/\\/g, '/')
const allowed = (p) => ALLOWLIST.some((rx) => rx.test(rel(p)))

const missingRoots = BUILT_ROOTS.filter((r) => { try { statSync(join(ROOT, r)); return false } catch { return true } })
if (missingRoots.length) {
  console.error('rename: build output missing (run the app builds first):\n  ' + missingRoots.join('\n  '))
  process.exit(1)
}

// Font aliases the CSS declares are protected on both sides (see core.mjs).
const declared = collectFontAliases(BUILT_ROOTS.map((r) => join(ROOT, r)))
protectFontAliases(declared)

let js = 0, html = 0, literals = 0
const skipped = []
for (const r of BUILT_ROOTS) {
  for (const p of files(join(ROOT, r))) {
    if (allowed(p)) continue
    const ext = extname(p).toLowerCase()
    if (ext === '.js' || ext === '.cjs' || ext === '.mjs') {
      const src = readFileSync(p, 'utf8')
      const out = rewriteJs(src)
      skipped.push(...out.skipped.map((s) => `${rel(p)}: ${s.raw.slice(0, 100)}`))
      if (out.changed) { writeFileSync(p, out.code); js++; literals += out.changed }
    } else if (ext === '.html' || ext === '.htm') {
      const src = readFileSync(p, 'utf8')
      // rewrite only the text between comments
      const out = src.split(/(<!--[\s\S]*?-->)/).map((part, i) => (i % 2 ? part : applyRules(part))).join('')
      if (out !== src) { writeFileSync(p, out); html++ }
    }
  }
}

console.log(`rename: ${literals} literals in ${js} JS files, ${html} HTML files; ` +
  `${declared.size} font aliases protected`)
if (skipped.length) {
  console.log(`rename: ${skipped.length} structural literals left as-is (module paths / object keys):`)
  for (const s of skipped) console.log('  ' + s)
}
