#!/usr/bin/env node
// Verify a PACKAGED OxeeOffice build, from the unpacked directory
// electron-builder writes next to the installers (win-unpacked/,
// linux-unpacked/).
//
//   node brand/scripts/verify-package.mjs <unpacked-dir> <expected-version>
//
// Everything before this checks the build tree. This checks what users
// actually install: the pre-fork pipeline once reported success while the
// shipped app was broken, because the assertion looked at the wrong thing.

import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../..', import.meta.url))
const require = createRequire(import.meta.url)
const asar = require('@electron/asar')
const brand = JSON.parse(readFileSync(join(ROOT, 'brand/config/brand.config.json'), 'utf8'))

const [dir, version] = process.argv.slice(2)
if (!dir || !version) {
  console.error('usage: verify-package.mjs <unpacked-dir> <expected-version>')
  process.exit(2)
}

const res = join(dir, 'resources')
const problems = []
const check = (ok, msg) => { if (!ok) problems.push(msg) }

// 1. identity baked into the app's package.json
const extracted = mkdtempSync(join(tmpdir(), 'oxeeoffice-asar-'))
try {
  asar.extractAll(join(res, 'app.asar'), extracted)
  const pkg = JSON.parse(readFileSync(join(extracted, 'package.json'), 'utf8'))
  check(pkg.productName === brand.productName,
    `package.json productName is "${pkg.productName}" (app.getName(), userData folder, taskbar) — expected "${brand.productName}"`)
  check(pkg.version === version, `package.json version is "${pkg.version}" — expected "${version}"`)
  // PRIVACY.md and the README promise no usage analytics. Upstream's tracker
  // only runs when a build injects GA4 credentials here, so their absence is
  // the guarantee — enforce it rather than trust it. Same for upstream's font
  // CDN endpoint, which would send requests to a third-party server.
  check(!('genofficeAnalytics' in pkg), 'package.json carries analytics credentials (genofficeAnalytics)')
  check(!('genofficeFontCdn' in pkg), 'package.json carries upstream font CDN endpoint (genofficeFontCdn)')

  // 2. the update feed the installed app will poll
  const ymlPath = join(res, 'app-update.yml')
  if (!existsSync(ymlPath)) {
    problems.push('resources/app-update.yml missing — auto-update would be silently disabled')
  } else {
    const yml = readFileSync(ymlPath, 'utf8')
    for (const [k, v] of [['provider', 'github'], ['owner', brand.publish.owner], ['repo', brand.publish.repo]]) {
      check(new RegExp(`^${k}:\\s*['"]?${v}['"]?\\s*$`, 'm').test(yml), `app-update.yml ${k} is not ${v}:\n${yml}`)
    }
  }

  // 3. the executable users launch
  const exe = process.platform === 'win32' || existsSync(join(dir, `${brand.productName}.exe`))
    ? join(dir, `${brand.productName}.exe`)
    : join(dir, brand.linux.executableName)
  check(existsSync(exe), `executable missing: ${exe}`)
  check(!existsSync(join(dir, 'GenOffice.exe')), 'GenOffice.exe present in the package')

  // 4. no visible upstream names in anything that ships
  const roots = [extracted, join(res, 'modules'), join(res, 'cli', 'genoffice.cjs')].filter(existsSync)
  const scan = spawnSync(process.execPath, [join(ROOT, 'brand/scripts/scan-visible-names.mjs'), '--fail', ...roots], {
    encoding: 'utf8',
  })
  process.stdout.write(scan.stdout)
  check(scan.status === 0, 'visible upstream names in the packaged app (see scan above)')
} finally {
  rmSync(extracted, { recursive: true, force: true })
}

if (problems.length) {
  console.error('\nverify-package: FAILED')
  for (const p of problems) console.error('  - ' + p)
  process.exit(1)
}
console.log(`verify-package: ok — ${brand.productName} ${version}, GitHub update feed, no visible upstream names`)
