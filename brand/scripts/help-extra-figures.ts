/**
 * OxeeOffice — captures the four manual figures upstream made by hand, so they
 * show OxeeOffice rather than upstream's branding: the tab strip, the Docs AI
 * panel, the Markdown toolbar and a PDF redaction.
 *
 *   npx tsx brand/scripts/help-extra-figures.ts <outDir>
 *
 * Run by brand/scripts/make-help-figures.mjs on a renamed build. Same method as
 * upstream's tools/gen-help-screenshots.ts: a scratch HOME and userData with
 * sample files, a 1360-px CSS viewport at 2x, raw CDP captures.
 */
import { _electron as electron, type CDPSession, type ElectronApplication, type Page } from '@playwright/test'
import { createRequire } from 'node:module'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

import { buildBlankDocx } from '../../packages/docx-engine/src/blank'
import { buildSheetsFixture } from '../../apps/sheets/tests/fixture-builder'

const REPO = resolve(__dirname, '../..')
const SHELL_DIR = join(REPO, 'apps/shell')
const OUT_DIR = resolve(process.argv[2] ?? join(REPO, 'brand/.scratch/help'))

function minimalPdf(): Buffer {
  const stream =
    'BT /F1 18 Tf 72 700 Td (OxeeOffice Manual Sample) Tj ET\n' +
    'BT /F1 11 Tf 72 660 Td (This paragraph is here so you can try text selection.) Tj ET\n' +
    'BT /F1 11 Tf 72 620 Td (SECRET ONE needs redaction.) Tj ET\n' +
    'BT /F1 11 Tf 72 580 Td (More filler text on the sample page.) Tj ET'
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>',
    `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ]
  let body = '%PDF-1.4\n'
  const offsets: number[] = []
  objects.forEach((o, i) => {
    offsets.push(Buffer.byteLength(body))
    body += `${i + 1} 0 obj\n${o}\nendobj\n`
  })
  const xref = Buffer.byteLength(body)
  body += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  for (const off of offsets) body += `${String(off).padStart(10, '0')} 00000 n \n`
  body += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`
  return Buffer.from(body)
}

async function launch(): Promise<{ app: ElectronApplication; samples: string; dispose: () => void }> {
  const root = mkdtempSync(join(tmpdir(), 'oxeeoffice-help-extra-'))
  const home = join(root, 'home')
  const userData = join(root, 'userdata')
  const samples = join(root, 'help-samples')
  const saveDir = process.platform === 'win32' ? 'C:\\OxeeOffice' : '/tmp/OxeeOffice'
  for (const dir of [home, userData, samples, saveDir]) mkdirSync(dir, { recursive: true })
  writeFileSync(join(samples, 'doc.docx'), await buildBlankDocx())
  writeFileSync(join(samples, 'book.xlsx'), await buildSheetsFixture())
  writeFileSync(join(samples, 'sample.pdf'), minimalPdf())
  writeFileSync(join(samples, 'notes.md'), '# Sample\n\nA markdown note.\n')
  writeFileSync(
    join(userData, 'app-settings.json'),
    JSON.stringify({ onboardingSeen: true, folderRoots: [samples], defaultSaveDir: saveDir, starPrompt: { resolved: true } }),
  )
  const require = createRequire(join(SHELL_DIR, 'package.json'))
  const { ELECTRON_RUN_AS_NODE: _drop, ...hostEnv } = process.env
  const app = await electron.launch({
    executablePath: require('electron') as unknown as string,
    args: process.platform === 'linux' ? ['--no-sandbox', '--disable-gpu', SHELL_DIR] : [SHELL_DIR],
    env: {
      ...hostEnv,
      HOME: home,
      GENOFFICE_USER_DATA: userData,
      GENOFFICE_AUTH_DIR: join(home, '.genoffice'),
      GENOFFICE_NO_SPARE_VIEW: '1',
      GENOFFICE_LANG: 'en',
    },
  })
  return { app, samples, dispose: () => rmSync(root, { recursive: true, force: true }) }
}

async function frame(page: Page, height: number): Promise<CDPSession> {
  const cdp = await page.context().newCDPSession(page)
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1360, height, deviceScaleFactor: 2, mobile: false })
  await page.waitForTimeout(800)
  return cdp
}

async function shot(cdp: CDPSession, name: string, clip?: { x: number; y: number; width: number; height: number }) {
  const { data } = await cdp.send('Page.captureScreenshot', {
    format: 'png',
    fromSurface: true,
    ...(clip ? { clip: { ...clip, scale: 1 } } : {}),
  })
  writeFileSync(join(OUT_DIR, `${name}.en.png`), Buffer.from(data, 'base64'))
  process.stdout.write(`wrote ${name}.en.png\n`)
}

async function pageWith(app: ElectronApplication, part: string): Promise<Page> {
  const end = Date.now() + 40_000
  while (Date.now() < end) {
    for (const p of app.windows()) {
      const href = await p.evaluate(() => location.href).catch(() => '')
      if (href.includes(part)) return p
    }
    await app.waitForEvent('window', { timeout: 1000 }).catch(() => {})
  }
  throw new Error(`no page ${part}`)
}

async function openSample(home: Page, name: string): Promise<void> {
  await home.evaluate(() => window.aiOfficeTabs.activate('home'))
  await home.waitForTimeout(500)
  await home.locator('.tree-item').filter({ hasText: 'help-samples' }).locator('.tree-name').first().click()
  const row = home.locator('.recent-row').filter({ hasText: name }).first()
  await row.waitFor({ state: 'visible', timeout: 15_000 })
  await row.dblclick()
}

async function main(): Promise<void> {
  mkdirSync(OUT_DIR, { recursive: true })
  const { app, dispose } = await launch()
  try {
    const home = app.windows()[0] ?? (await app.firstWindow())
    await home.waitForSelector('.quick-card', { timeout: 60_000 })
    await home.setViewportSize({ width: 1360, height: 850 })

    // 1. Docs with its AI panel
    await openSample(home, 'doc.docx')
    const docs = await pageWith(app, '://docs/')
    await docs.waitForSelector('.ai-panel', { timeout: 40_000 })
    const editable = docs.locator('[contenteditable="true"]').first()
    await editable.click()
    await docs.keyboard.type('Sample document')
    await docs.keyboard.press('Enter')
    await docs.keyboard.type('The first paragraph shows the body style.')
    await docs.keyboard.press('Enter')
    await docs.keyboard.type('The second paragraph shows the heading styles and the outline.')
    const docsCdp = await frame(docs, 860)
    await shot(docsCdp, 'ai-panel')

    // 2. the tab strip: Home and two documents
    await openSample(home, 'book.xlsx')
    await pageWith(app, '://sheets/')
    await home.evaluate(() => window.aiOfficeTabs.activate('home'))
    await home.waitForTimeout(600)
    const homeCdp = await frame(home, 850)
    const strip = await home.locator('.tab-strip').first().boundingBox()
    if (!strip) throw new Error('tab strip not measurable')
    await shot(homeCdp, 'tabs', { x: 0, y: strip.y, width: Math.min(1244, strip.x + strip.width), height: strip.height })

    // 3. the Markdown toolbar
    await openSample(home, 'notes.md')
    const md = await pageWith(app, '://markdown/')
    await md.waitForTimeout(1500)
    const mdCdp = await frame(md, 850)
    await shot(mdCdp, 'md-toolbar', { x: 0, y: 0, width: 1360, height: 120 })

    // 4. a PDF page after marking a redaction
    await openSample(home, 'sample.pdf')
    const pdf = await pageWith(app, '://pdf/')
    await pdf.waitForTimeout(2500)
    await pdf.getByRole('tab', { name: 'Annotate' }).first().click().catch(async () => {
      await pdf.locator('text=Annotate').first().click()
    })
    await pdf.waitForTimeout(500)
    await pdf.locator('button', { hasText: 'Redact area' }).first().click()
    await pdf.waitForTimeout(400)
    const target = pdf.locator('span', { hasText: 'SECRET ONE needs redaction.' }).first()
    const box = await target.boundingBox()
    if (!box) throw new Error('redaction target not found')
    await pdf.mouse.move(box.x - 4, box.y - 3)
    await pdf.mouse.down()
    await pdf.mouse.move(box.x + box.width + 4, box.y + box.height + 3, { steps: 8 })
    await pdf.mouse.up()
    await pdf.waitForTimeout(800)
    const pdfCdp = await frame(pdf, 860)
    await shot(pdfCdp, 'pdf-redact')
  } finally {
    await app.close().catch(() => {})
    dispose()
  }
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err)
    process.exit(1)
  },
)
