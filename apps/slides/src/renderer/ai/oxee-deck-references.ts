/**
 * OxeeOffice: deck pages are written one at a time, and each page sees the JSON
 * specs of the pages already written, so one designer carries the look through
 * the deck (colours, fonts, title placement, cards, decoration). Upstream writes
 * pages in parallel from a text style guide alone, which drifts page to page.
 */

export interface DeckPageSpec {
  pageIndex: number
  title: string
  spec: string
}

/** Reference budget per page request; the first page is always kept. */
export const REFERENCE_MAX_CHARS = 24_000

/**
 * The pages before `pageIndex` to show as references: page 1 plus the most
 * recent earlier pages, in deck order, within `maxChars` of spec text.
 */
export function pickReferencePages(
  specs: ReadonlyArray<DeckPageSpec | undefined>,
  pageIndex: number,
  maxChars = REFERENCE_MAX_CHARS,
): DeckPageSpec[] {
  const earlier = specs.filter((s): s is DeckPageSpec => !!s && s.pageIndex < pageIndex)
  if (earlier.length === 0) return []
  const [first, ...rest] = earlier
  const picked: DeckPageSpec[] = []
  let used = first!.spec.length
  for (let i = rest.length - 1; i >= 0; i--) {
    const s = rest[i]!
    if (used + s.spec.length > maxChars) break
    picked.unshift(s)
    used += s.spec.length
  }
  return [first!, ...picked]
}

/** Prompt block for the page request; empty when there is nothing to match yet. */
export function referenceBlock(refs: ReadonlyArray<DeckPageSpec> | undefined): string {
  if (!refs?.length) return ''
  const pages = refs.map((r) => `Page ${r.pageIndex} (${r.title}):\n${r.spec.trim()}`).join('\n\n')
  return (
    'Pages already designed for this deck, in order. This page must look like part of the same deck: ' +
    'reuse their background, colour palette, fonts, text sizes, title position and size, card shapes, ' +
    'corner style and decoration exactly. Only the arrangement of this page’s own content may differ.\n\n' +
    `${pages}\n\n`
  )
}
