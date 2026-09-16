// Dev helper: rasterize an SVG to PNG through the system Edge/Chrome, for
// eyeballing brand assets.  node brand/scripts/render-svg.mjs in.svg out.png [bg]
import { chromium } from 'playwright'
import { readFileSync } from 'node:fs'
const [, , input, output, bg = '#f4f4f6'] = process.argv
const svg = readFileSync(input, 'utf8')
let browser
for (const channel of ['msedge', 'chrome']) {
  try { browser = await chromium.launch({ channel }); break } catch {}
}
if (!browser) throw new Error('no system Edge/Chrome for playwright')
const page = await browser.newPage({ viewport: { width: 900, height: 260 } })
await page.setContent(`<body style="margin:0;background:${bg};display:grid;place-items:center;height:100vh">
  <div style="width:820px">${svg.replace('<svg', '<svg style="width:100%;height:auto"')}</div></body>`)
await page.screenshot({ path: output })
await browser.close()
