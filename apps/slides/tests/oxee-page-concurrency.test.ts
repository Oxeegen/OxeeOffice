// OxeeOffice: generate_deck writes pages `pageConcurrency()` at a time (upstream: 2).
import { describe, expect, it } from 'vitest'
import { createSlidesSkill, type DeckAccess } from '../src/renderer/ai/slides-skill'
import type { RenderSlide } from '@genoffice/pptx-render'
import type { AgentToolCall } from '../src/shared/ipc'

function measure(pageConcurrency?: () => number | undefined) {
  let inFlight = 0
  let peak = 0
  let pages = 0
  const access: DeckAccess = {
    getSlides: () => [] as RenderSlide[],
    getCurrent: () => 0,
    getSelectedIds: () => [],
    applySlide: () => {},
    applyDeck: () => {},
    fitWidthPx: 1280,
    retryBackoffMs: 0,
    ...(pageConcurrency ? { pageConcurrency } : {}),
    landGeneratedPages: async (markers, mode = 'replace') => {
      pages = mode === 'append' ? pages + markers.length : markers.length
      return { ok: true, pages }
    },
    isCloudPageGenEnabled: async () => false,
    generatePageLocal: async (args) => {
      inFlight += 1
      peak = Math.max(peak, inFlight)
      await new Promise((resolve) => setTimeout(resolve, 5))
      inFlight -= 1
      return { ok: true, marker: `localpptx:PAGE${args.pageIndex}` }
    },
    generateStyleSkill: async () => ({ ok: true, styleSkill: 'STYLE' }),
    searchImages: async () => [],
  }
  return { access, peak: () => peak, pages: () => pages }
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

describe('generate_deck page concurrency', () => {
  it('generates 4 pages at a time when the access asks for 4', async () => {
    const m = measure(() => 4)
    await createSlidesSkill(m.access).executeTool(deckCall(8))
    expect(m.peak()).toBe(4)
    expect(m.pages()).toBe(8)
  })

  it('keeps upstream concurrency (2) otherwise', async () => {
    for (const m of [measure(), measure(() => undefined)]) {
      await createSlidesSkill(m.access).executeTool(deckCall(8))
      expect(m.peak()).toBe(2)
      expect(m.pages()).toBe(8)
    }
  })
})
