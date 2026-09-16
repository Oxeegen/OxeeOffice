/**
 * OxeeOffice — Brave Search backend (fork-owned file).
 *
 * The "Oxeegen" search entry in Settings > AI Media & Search is backed by the
 * Brave Search API for now: its key field takes a Brave key (Oxeegen's
 * decision, 2026-09-16). Upstream ships only Serper and Tavily. Field mapping
 * carried over from the pre-fork OxeeOffice build, where it ran in production.
 *
 * Both functions return null (never throw) when the key is empty, the call
 * fails or nothing comes back, so the caller's fallback chain continues.
 */

import {
  asRecord,
  isCopyrightHost,
  safeHost,
  type ImageSearchResult,
  type WebSearchResult,
} from './shared'

const BRAVE_API = 'https://api.search.brave.com/res/v1'
const TIMEOUT_MS = 15_000

async function braveFetch(path: string, key: string, query: string, count: number): Promise<unknown> {
  const url = new URL(`${BRAVE_API}/${path}`)
  url.searchParams.set('q', query)
  url.searchParams.set('count', String(Math.max(1, Math.min(20, Math.floor(count)))))
  const resp = await fetch(url, {
    headers: { 'X-Subscription-Token': key, Accept: 'application/json' },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
  if (!resp.ok) return null
  return resp.json()
}

export async function braveWebSearch(
  key: string | undefined,
  query: string,
  maxResults: number,
): Promise<{ results: WebSearchResult[]; method: 'brave' } | null> {
  if (!key?.trim()) return null
  try {
    const data = asRecord(await braveFetch('web/search', key.trim(), query, maxResults))
    const web = asRecord(data.web)
    const raw: unknown[] = Array.isArray(web.results) ? web.results : []
    const results: WebSearchResult[] = []
    for (const item of raw) {
      const o = asRecord(item)
      const url = String(o.url ?? '')
      if (!url) continue
      const extra = Array.isArray(o.extra_snippets) ? o.extra_snippets[0] : ''
      results.push({
        title: String(o.title ?? ''),
        url,
        snippet: String(o.description || extra || ''),
      })
      if (results.length >= maxResults) break
    }
    return results.length ? { results, method: 'brave' } : null
  } catch {
    return null
  }
}

export async function braveImageSearch(
  key: string | undefined,
  query: string,
  maxResults: number,
): Promise<{ images: ImageSearchResult[]; method: 'brave' } | null> {
  if (!key?.trim()) return null
  try {
    const data = asRecord(await braveFetch('images/search', key.trim(), query, maxResults))
    const raw: unknown[] = Array.isArray(data.results) ? data.results : []
    const images: ImageSearchResult[] = []
    for (const item of raw) {
      const o = asRecord(item)
      const props = asRecord(o.properties)
      const thumb = asRecord(o.thumbnail)
      const imageUrl = String(props.url || thumb.src || '')
      if (!imageUrl || isCopyrightHost(imageUrl)) continue
      const entry: ImageSearchResult = {
        title: String(o.title ?? ''),
        imageUrl,
        sourceUrl: String(o.url ?? ''),
        source: String(o.source || safeHost(o.url)),
      }
      if (typeof props.width === 'number') entry.width = props.width
      if (typeof props.height === 'number') entry.height = props.height
      images.push(entry)
      if (images.length >= maxResults) break
    }
    return images.length ? { images, method: 'brave' } : null
  } catch {
    return null
  }
}
