import { describe, expect, it } from 'vitest'
import JSZip from 'jszip'
import { generateDocx } from '../src/generate'

// 1x1 transparent PNG
const PNG_1PX = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  'base64',
)

describe('zero-area image nodes', () => {
  it('emits finite wp:extent instead of NaN/Infinity', async () => {
    const ir = [{ type: 'image', shotId: 's1', width: 0, height: 0 }]
    const buf = await generateDocx(ir, { s1: PNG_1PX }, {})
    const zip = await JSZip.loadAsync(buf)
    const xml = await zip.file('word/document.xml')!.async('string')
    expect(xml).not.toContain('NaN')
    expect(xml).not.toContain('Infinity')
    expect(xml).toMatch(/<wp:extent cx="\d+" cy="\d+"\/>/)
  })
})
