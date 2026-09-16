// OxeeOffice: generate_deck writes pages one at a time, each seeing the specs of
// the pages before it; upstream writes 2 at a time from the style text alone.
import { describe, expect, it } from 'vitest'
import { createSlidesSkill, type DeckAccess } from '../src/renderer/ai/slides-skill'
import { pickReferencePages, referenceBlock, type DeckPageSpec } from '../src/renderer/ai/oxee-deck-references'
import type { RenderSlide } from '@genoffice/pptx-render'
import type { AgentToolCall } from '../src/shared/ipc'

function measure(oxee?: { concurrency: number; references: boolean }, failures: Record<number, number> = {}) {
  let inFlight = 0
  let peak = 0
  let pages = 0
  const failing = { ...failures } // pageIndex -> attempts left to fail
  const seen: Array<{ page: number; refs: number[] | undefined }> = []
  const access: DeckAccess = {
    getSlides: () => [] as RenderSlide[],
    getCurrent: () => 0,
    getSelectedIds: () => [],
    applySlide: () => {},
    applyDeck: () => {},
    fitWidthPx: 1280,
    retryBackoffMs: 0,
    ...(oxee ? { pageConcurrency: () => oxee.concurrency, pageReferences: () => oxee.references } : {}),
    landGeneratedPages: async (markers, mode = 'replace', _deckName?: string, insertAt?: number) => {
      if (mode === 'insert_at') {
        pages += 1
        return { ok: true, pages, insertedIndex: insertAt }
      }
      if (mode === 'append') {
        const from = pages
        pages += markers.length
        return { ok: true, pages, appendedFrom: from }
      }
      pages = markers.length
      return { ok: true, pages }
    },
    isCloudPageGenEnabled: async () => false,
    generatePageLocal: async (args) => {
      seen.push({ page: args.pageIndex, refs: args.references?.map((r) => r.pageIndex) })
      inFlight += 1
      peak = Math.max(peak, inFlight)
      await new Promise((resolve) => setTimeout(resolve, 5))
      inFlight -= 1
      if ((failing[args.pageIndex] ?? 0) > 0) {
        failing[args.pageIndex]! -= 1
        return { ok: false, error: 'mock fail' }
      }
      return { ok: true, marker: `localpptx:PAGE${args.pageIndex}`, spec: `{"page":${args.pageIndex}}` }
    },
    generateStyleSkill: async () => ({ ok: true, styleSkill: 'STYLE' }),
    searchImages: async () => [],
  }
  return { access, seen, peak: () => peak, pages: () => pages }
}

const deckCall = (n: number): AgentToolCall => ({
  id: 'c-deck',
  name: 'generate_deck',
  input: {
    core_hook: 'Hook',
    style: 'Navy',
    pages: Array.from({ length: n }, (_, i) => ({
      title: `Page ${i + 1}`,
      brief: `brief ${i + 1}`,
      layout: 'data',
      image_queries: [],
    })),
  },
})

describe('generate_deck on Oxeegen: one page at a time, with references', () => {
  it('never runs two pages at once, and each page sees every page before it', async () => {
    const m = measure({ concurrency: 1, references: true })
    await createSlidesSkill(m.access).executeTool(deckCall(4))
    expect(m.peak()).toBe(1)
    expect(m.pages()).toBe(4)
    expect(m.seen).toEqual([
      { page: 1, refs: [] },
      { page: 2, refs: [1] },
      { page: 3, refs: [1, 2] },
      { page: 4, refs: [1, 2, 3] },
    ])
  })

  it('a page that failed is retried later with the pages before it that succeeded', async () => {
    // page 2 fails both inline attempts, so it is regenerated in the retry round after page 3
    const m = measure({ concurrency: 1, references: true }, { 2: 2 })
    await createSlidesSkill(m.access).executeTool(deckCall(3))
    expect(m.pages()).toBe(3)
    expect(m.seen.filter((s) => s.page === 2).at(-1)).toEqual({ page: 2, refs: [1] })
    expect(m.seen.find((s) => s.page === 3)).toEqual({ page: 3, refs: [1] })
  })

  it('keeps upstream behaviour otherwise: 2 at a time, no references', async () => {
    const m = measure()
    await createSlidesSkill(m.access).executeTool(deckCall(8))
    expect(m.peak()).toBe(2)
    expect(m.pages()).toBe(8)
    expect(m.seen.every((s) => s.refs === undefined)).toBe(true)
  })
})

describe('reference pages', () => {
  const spec = (pageIndex: number, size: number): DeckPageSpec => ({ pageIndex, title: `T${pageIndex}`, spec: 'x'.repeat(size) })

  it('keeps page 1 and the most recent pages within the budget, in deck order', () => {
    const specs = [spec(1, 100), spec(2, 100), spec(3, 100), spec(4, 100), spec(5, 100)]
    expect(pickReferencePages(specs, 6, 350).map((s) => s.pageIndex)).toEqual([1, 4, 5])
    expect(pickReferencePages(specs, 3).map((s) => s.pageIndex)).toEqual([1, 2])
    expect(pickReferencePages(specs, 1)).toEqual([])
    expect(pickReferencePages([undefined, spec(2, 10)], 3).map((s) => s.pageIndex)).toEqual([2])
  })

  it('formats nothing for the first page and every reference after it', () => {
    expect(referenceBlock([])).toBe('')
    expect(referenceBlock(undefined)).toBe('')
    const block = referenceBlock([
      { pageIndex: 1, title: 'Cover', spec: '{"a":1}' },
      { pageIndex: 2, title: 'Intro', spec: '{"b":2}' },
    ])
    expect(block).toContain('Page 1 (Cover):\n{"a":1}')
    expect(block).toContain('Page 2 (Intro):\n{"b":2}')
    expect(block).toMatch(/colour palette, fonts/)
  })
})
