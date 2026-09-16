// OxeeOffice — Brave behind the Oxeegen search entry, and no Genspark sign-in
// (fork-owned). The Oxeegen layer is switched on for this file only.

import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

type Search = typeof import('../src/index')
type Provider = typeof import('@genoffice/ai-provider')
let search: Search
let provider: Provider

beforeAll(async () => {
  vi.stubEnv('OXEEGEN_LAYER', '1')
  vi.resetModules()
  provider = await import('@genoffice/ai-provider')
  search = await import('../src/index')
})

afterEach(() => {
  vi.unstubAllGlobals()
})

afterAll(() => {
  vi.unstubAllEnvs()
  vi.resetModules()
})

function mockFetch(body: unknown, ok = true) {
  const calls: { url: string; headers: Record<string, string> }[] = []
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: URL | string, init?: RequestInit) => {
      calls.push({ url: String(url), headers: (init?.headers ?? {}) as Record<string, string> })
      return { ok, status: ok ? 200 : 401, json: async () => body } as Response
    }),
  )
  return calls
}

describe('Brave web search', () => {
  it('maps results and sends the key as X-Subscription-Token', async () => {
    const calls = mockFetch({
      web: {
        results: [
          { title: 'A', url: 'https://a.example', description: 'first' },
          { title: 'B', url: 'https://b.example', extra_snippets: ['second'] },
          { title: 'no url' },
        ],
      },
    })
    const r = await search.webSearch('oxeegen', 5, { useGsk: false, braveKey: 'brave-key' })
    expect(r).toEqual({
      method: 'brave',
      results: [
        { title: 'A', url: 'https://a.example', snippet: 'first' },
        { title: 'B', url: 'https://b.example', snippet: 'second' },
      ],
    })
    expect(calls[0]?.url).toMatch(/^https:\/\/api\.search\.brave\.com\/res\/v1\/web\/search\?q=oxeegen&count=5$/)
    expect(calls[0]?.headers['X-Subscription-Token']).toBe('brave-key')
  })

  it('is skipped entirely without a key', async () => {
    const { braveWebSearch } = await import('../src/brave')
    const calls = mockFetch({})
    expect(await braveWebSearch('', 'q', 3)).toBeNull()
    expect(calls).toHaveLength(0)
  })

  it('returns null on a rejected key so the chain can continue', async () => {
    const { braveWebSearch } = await import('../src/brave')
    mockFetch({ error: 'unauthorized' }, false)
    expect(await braveWebSearch('bad', 'q', 3)).toBeNull()
  })
})

describe('Brave image search', () => {
  it('maps images, skips copyright hosts, keeps dimensions', async () => {
    mockFetch({
      results: [
        {
          title: 'Wind farm',
          url: 'https://news.example/wind',
          source: 'news.example',
          properties: { url: 'https://img.example/wind.jpg', width: 1200, height: 800 },
        },
        { title: 'stock', url: 'https://x', properties: { url: 'https://media.gettyimages.com/p.jpg' } },
        { title: 'thumb only', url: 'https://t.example/p', thumbnail: { src: 'https://t.example/t.jpg' } },
      ],
    })
    const r = await search.imageSearch('wind', 8, { useGsk: false, braveKey: 'k' })
    expect(r.method).toBe('brave')
    expect(r.images).toEqual([
      {
        title: 'Wind farm',
        imageUrl: 'https://img.example/wind.jpg',
        sourceUrl: 'https://news.example/wind',
        source: 'news.example',
        width: 1200,
        height: 800,
      },
      { title: 'thumb only', imageUrl: 'https://t.example/t.jpg', sourceUrl: 'https://t.example/p', source: 't.example' },
    ])
  })
})

describe('settings → search backend', () => {
  it('routes the Oxeegen entry to Brave with its key, and nothing else', () => {
    const settings = provider.defaultAiSettings()
    settings.search = { provider: 'oxeegen', providers: { ...settings.search!.providers, oxeegen: { apiKey: 'brave-key' } } }
    expect(search.searchOptionsFromSettings(settings)).toEqual({ useGsk: false, braveKey: 'brave-key' })
  })
})

describe('no Genspark sign-in', () => {
  it('ignores GSK_API_KEY and any Genspark CLI login on the machine', () => {
    vi.stubEnv('GSK_API_KEY', 'a-genspark-key')
    expect(search.gskApiKey()).toBe('')
    expect(search.hasGskAuth()).toBe(false)
    vi.stubEnv('GSK_API_KEY', '')
  })
})
