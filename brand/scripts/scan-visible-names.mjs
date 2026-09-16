#!/usr/bin/env node
// Scan built output for user-visible upstream product names.
//
//   node brand/scripts/scan-visible-names.mjs            report
//   node brand/scripts/scan-visible-names.mjs --fail     exit 1 on any hit (CI)
//   node brand/scripts/scan-visible-names.mjs --verbose  print every hit
//   node brand/scripts/scan-visible-names.mjs <path>...  scan other roots
//                                                        (e.g. an extracted app.asar)
//
// JS is scanned through the same literal finder the renamer uses, so a JS hit
// here is exactly something rename-built-output.mjs did not rewrite. CSS and
// HTML are scanned with comments stripped; other text files line by line.
// Protected @font-face aliases (rename/core.mjs FONT_ALIASES) never count.

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, extname, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { findBrandLiterals, hasRenameable, collectFontAliases, protectFontAliases } from '../rename/core.mjs'
import { BUILT_ROOTS, ALLOWLIST } from '../rename/roots.mjs'

const ROOT = fileURLToPath(new URL('../..', import.meta.url))
const args = process.argv.slice(2)
const FAIL = args.includes('--fail')
const VERBOSE = args.includes('--verbose')
const roots = args.filter((a) => !a.startsWith('--'))
const scanRoots = roots.length ? roots : BUILT_ROOTS.map((r) => join(ROOT, r))
protectFontAliases(collectFontAliases(scanRoots))

const JS = new Set(['.js', '.cjs', '.mjs'])
const TEXT = new Set(['.html', '.htm', '.json', '.css', '.svg', '.md', '.txt', '.yml', '.yaml', '.desktop', '.xml', '.plist'])
const CSS_COMMENT = /\/\*[\s\S]*?\*\//g
const HTML_COMMENT = /<!--[\s\S]*?-->/g

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

// forward slashes regardless of platform, without a backslash in source
const rel = (p) => relative(ROOT, p).split(sep).join('/')
const allowed = (p) => ALLOWLIST.some((rx) => rx.test(rel(p)))

let visible = 0, structural = 0, filesHit = 0, parseErrors = 0
const byFile = []
for (const root of scanRoots) {
  for (const p of files(root)) {
    const ext = extname(p).toLowerCase()
    if (!JS.has(ext) && !TEXT.has(ext)) continue
    if (allowed(p)) continue
    const code = readFileSync(p, 'utf8')
    const v = [], s = []
    if (JS.has(ext)) {
      try {
        for (const h of findBrandLiterals(code)) {
          if (hasRenameable(h.raw)) (h.structural ? s : v).push(h.raw)
        }
      } catch (err) {
        parseErrors++
        console.error(`  ! parse error ${rel(p)}: ${err.message}`)
        continue
      }
    } else {
      let text = code
      if (ext === '.css') text = text.replace(CSS_COMMENT, '')
      if (ext === '.html' || ext === '.htm') text = text.replace(HTML_COMMENT, '').replace(CSS_COMMENT, '')
      for (const line of text.split('\n')) if (hasRenameable(line)) v.push(line.trim())
    }
    if (!v.length && !s.length) continue
    filesHit++
    visible += v.length
    structural += s.length
    byFile.push({ file: rel(p), v, s })
  }
}

byFile.sort((a, b) => b.v.length - a.v.length)
for (const { file, v, s } of byFile) {
  console.log(`${String(v.length).padStart(5)} visible ${String(s.length).padStart(3)} structural  ${file}`)
  if (VERBOSE) {
    for (const raw of v) console.log('        ' + raw.slice(0, 160).replace(/\s+/g, ' '))
    for (const raw of s) console.log('      S ' + raw.slice(0, 160).replace(/\s+/g, ' '))
  }
}
console.log(`\n${visible} visible, ${structural} structural (reported, never rewritten) in ${filesHit} files; ${parseErrors} parse errors`)
if (FAIL && (visible > 0 || parseErrors > 0)) {
  console.error('\nFAIL: upstream product names are still visible in the built app.')
  process.exit(1)
}
