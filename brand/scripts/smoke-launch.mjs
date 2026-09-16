#!/usr/bin/env node
// Launch OxeeOffice and prove it actually starts: Home renders, the preload
// bridge is up, and Oxeegen is the first provider offered.
//
//   node brand/scripts/smoke-launch.mjs <unpacked-dir>   packaged app (CI, after electron-builder)
//   node brand/scripts/smoke-launch.mjs --dev            the built tree via electron apps/shell
//
// Every other check reads files. This one exists because a crash in the
// sandboxed preload shipped past all of them in development: the package was
// complete, the scan was clean, and the app opened to a blank window.
// On Linux, run it under xvfb-run.

import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { homedir, tmpdir } from 'node:os'
import { join } from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../..', import.meta.url))
const require = createRequire(import.meta.url)
const { _electron: electron } = require('@playwright/test')
const brand = JSON.parse(readFileSync(join(ROOT, 'brand/config/brand.config.json'), 'utf8'))

const arg = process.argv[2]
if (!arg) {
  console.error('usage: smoke-launch.mjs <unpacked-dir> | --dev')
  process.exit(2)
}
const dev = arg === '--dev'
const linux = process.platform === 'linux'

const { ELECTRON_RUN_AS_NODE: _runAsNode, ...env } = process.env
let launch
let cleanup = () => {}
if (dev) {
  const userData = mkdtempSync(join(tmpdir(), 'oxeeoffice-smoke-'))
  writeFileSync(join(userData, 'app-settings.json'), JSON.stringify({ onboardingSeen: true }))
  cleanup = () => rmSync(userData, { recursive: true, force: true })
  launch = {
    executablePath: require('electron'),
    args: [...(linux ? ['--no-sandbox', '--disable-gpu'] : []), join(ROOT, 'apps/shell')],
    env: { ...env, GENOFFICE_USER_DATA: userData, GENOFFICE_NO_SPARE_VIEW: '1', GENOFFICE_LANG: 'en' },
  }
} else {
  // a packaged app always uses its real userData folder; on a CI runner that
  // folder is fresh — seed it so the first-run overlay does not cover Home
  const userData =
    process.platform === 'win32'
      ? join(process.env.APPDATA ?? join(homedir(), 'AppData', 'Roaming'), brand.productName)
      : join(process.env.XDG_CONFIG_HOME ?? join(homedir(), '.config'), brand.productName)
  mkdirSync(userData, { recursive: true })
  writeFileSync(join(userData, 'app-settings.json'), JSON.stringify({ onboardingSeen: true }))
  const exe =
    process.platform === 'win32' ? join(arg, `${brand.productName}.exe`) : join(arg, brand.linux.executableName)
  launch = {
    executablePath: exe,
    args: linux ? ['--no-sandbox', '--disable-gpu'] : [],
    env: { ...env, GENOFFICE_LANG: 'en', ...(linux ? { ELECTRON_DISABLE_SANDBOX: '1' } : {}) },
  }
}

const problems = []
const logs = []
let app
try {
  app = await electron.launch({ ...launch, timeout: 60_000 })
  const page = await app.firstWindow({ timeout: 60_000 })
  page.on('console', (m) => { if (m.type() === 'error') logs.push(m.text()) })
  page.on('pageerror', (e) => logs.push(e.message))

  const deadline = Date.now() + 45_000
  let state = null
  while (Date.now() < deadline) {
    state = await page
      .evaluate(() => ({
        hero: !!document.querySelector('.home-hero'),
        bridge: typeof window.aiOffice?.getAiProviders === 'function',
        title: document.title,
      }))
      .catch(() => null)
    if (state?.hero && state?.bridge) break
    await new Promise((r) => setTimeout(r, 500))
  }
  if (!state?.bridge) problems.push('preload bridge (window.aiOffice) missing — the preload failed to load')
  if (!state?.hero) problems.push('Home never rendered')
  if (state?.title && !state.title.includes(brand.productName)) problems.push(`window title is "${state.title}"`)

  if (state?.bridge) {
    const providers = await page.evaluate(() => window.aiOffice.getAiProviders().map((p) => p.id))
    if (providers[0] !== 'oxeegen') problems.push(`first provider is "${providers[0]}", expected oxeegen`)
    if (providers.includes('genspark')) problems.push('Genspark sign-in provider is offered')
    const settings = await page.evaluate(() => window.aiOffice.getAiSettings())
    if (settings?.provider !== 'oxeegen') problems.push(`default provider is "${settings?.provider}"`)
  }
} catch (err) {
  problems.push(`launch failed: ${err?.message ?? err}`)
} finally {
  await app?.close().catch(() => {})
  cleanup()
}

if (problems.length) {
  console.error('smoke-launch: FAILED')
  for (const p of problems) console.error('  - ' + p)
  if (logs.length) console.error('renderer errors:\n  ' + logs.slice(0, 10).join('\n  '))
  process.exit(1)
}
console.log(`smoke-launch: ok — ${brand.productName} started, Home rendered, Oxeegen is the default provider`)
