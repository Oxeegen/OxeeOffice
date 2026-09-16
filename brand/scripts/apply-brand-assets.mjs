#!/usr/bin/env node
// Copy brand assets over the upstream files that are read by fixed path.
//
//   node brand/scripts/apply-brand-assets.mjs            apply
//   node brand/scripts/apply-brand-assets.mjs --restore  put upstream's back (git)
//
// Run BEFORE the app builds: renderer images are bundled by Vite, so swapping
// them after `build:all` has no effect. Images carry no text, which is why
// they need an explicit list here — scan-visible-names.mjs cannot see a
// wordmark drawn as SVG paths.
//
// Every target must already exist. If upstream renames or moves one, this
// fails instead of silently shipping upstream's artwork.

import { copyFileSync, existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../..', import.meta.url))
const A = 'brand/assets'

const ICON_SIZES = [16, 32, 48, 64, 128, 256, 512, 1024].map((s) => `${s}x${s}.png`)
const FILE_TYPES = ['docx', 'xlsx', 'pptx', 'pdf', 'md', 'html']

/** [brand source, upstream target] */
export const ASSETS = [
  // installer / exe / taskbar icon (Windows) and the Linux hicolor set
  [`${A}/build/icon.ico`, 'apps/shell/build/icon.ico'],
  [`${A}/build/icon.png`, 'apps/shell/build/icon.png'],
  ...ICON_SIZES.map((f) => [`${A}/build/icons/${f}`, `apps/shell/build/icons/${f}`]),
  // per-type document icons for the OS file associations
  ...FILE_TYPES.map((t) => [`${A}/build/${t}.ico`, `apps/shell/build/${t}.ico`]),
  // Home-screen wordmark and the in-app icon (docs/sheets/slides keep
  // byte-identical copies; unused today, swapped so a future import is right)
  [`${A}/renderer/oxeeoffice-logo.svg`, 'apps/shell/src/renderer/src/assets/genoffice-logo.svg'],
  [`${A}/renderer/app-icon.png`, 'apps/shell/src/renderer/src/assets/app-icon.png'],
  [`${A}/renderer/app-icon.png`, 'apps/docs/src/renderer/assets/app-icon.png'],
  [`${A}/renderer/app-icon.png`, 'apps/sheets/src/renderer/assets/app-icon.png'],
  [`${A}/renderer/app-icon.png`, 'apps/slides/src/renderer/assets/app-icon.png'],
]

function main() {
  const restore = process.argv.includes('--restore')
  const missing = ASSETS.flatMap(([src, dst]) => [
    ...(restore || existsSync(join(ROOT, src)) ? [] : [`brand source missing: ${src}`]),
    ...(existsSync(join(ROOT, dst)) ? [] : [`upstream target missing: ${dst}`]),
  ])
  // an upstream icon size we do not supply would ship upstream's artwork
  const upstreamSizes = readdirSync(join(ROOT, 'apps/shell/build/icons'))
  for (const f of upstreamSizes) if (!ICON_SIZES.includes(f)) missing.push(`unmapped upstream icon: apps/shell/build/icons/${f}`)
  if (missing.length) {
    console.error('apply-brand-assets:\n  ' + missing.join('\n  '))
    console.error('Upstream moved or added an asset. Update ASSETS in brand/scripts/apply-brand-assets.mjs.')
    process.exit(1)
  }

  if (restore) {
    execFileSync('git', ['checkout', '--', ...new Set(ASSETS.map(([, dst]) => dst))], { cwd: ROOT, stdio: 'inherit' })
    console.log(`apply-brand-assets: restored ${ASSETS.length} upstream files`)
    return
  }
  for (const [src, dst] of ASSETS) copyFileSync(join(ROOT, src), join(ROOT, dst))
  console.log(`apply-brand-assets: ${ASSETS.length} files`)
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main()
