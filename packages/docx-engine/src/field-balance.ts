/**
 * Complex fields are begin/separate/end run triples, and Word treats an
 * unbalanced sequence as a damaged file (repair prompt, or the rest of the
 * document swallowed as one field result). Editing a field whose result spans
 * paragraphs (Zotero bibliographies) can drop the paragraph carrying the begin
 * or the end run, so the assembled body is balanced once more before it is
 * written: stray separate/end runs go, and a begin left open is closed at the
 * end of its own paragraph so the field keeps its code and first result line.
 */

interface Edit {
  start: number
  end: number
  text: string
}

interface Token {
  start: number
  kind: 'p-open' | 'p-close' | 'field'
  fieldType?: 'begin' | 'separate' | 'end'
  selfClosing?: boolean
}

function opaqueEnd(xml: string, start: number): number | null {
  if (xml.startsWith('<!--', start)) {
    const at = xml.indexOf('-->', start + 4)
    return at === -1 ? xml.length : at + 3
  }
  if (xml.startsWith('<![CDATA[', start)) {
    const at = xml.indexOf(']]>', start + 9)
    return at === -1 ? xml.length : at + 3
  }
  if (xml.startsWith('<?', start)) {
    const at = xml.indexOf('?>', start + 2)
    return at === -1 ? xml.length : at + 2
  }
  if (!xml.startsWith('<!', start)) return null
  let quote = ''
  let subsetDepth = 0
  for (let index = start + 2; index < xml.length; index += 1) {
    const character = xml[index]
    if (quote) {
      if (character === quote) quote = ''
    } else if (character === '"' || character === "'") {
      quote = character
    } else if (character === '[') {
      subsetDepth += 1
    } else if (character === ']') {
      subsetDepth = Math.max(0, subsetDepth - 1)
    } else if (character === '>' && subsetDepth === 0) {
      return index + 1
    }
  }
  return xml.length
}

function tagEnd(xml: string, start: number): number {
  let quote = ''
  for (let index = start + 1; index < xml.length; index += 1) {
    const character = xml[index]
    if (quote) {
      if (character === quote) quote = ''
    } else if (character === '"' || character === "'") {
      quote = character
    } else if (character === '>') {
      return index + 1
    }
  }
  return xml.length
}

function nextTag(xml: string, cursor: number): { start: number; end: number; text: string } | null {
  const start = xml.indexOf('<', cursor)
  if (start === -1) return null
  const opaque = opaqueEnd(xml, start)
  if (opaque !== null) return { start, end: opaque, text: '' }
  const end = tagEnd(xml, start)
  return { start, end, text: xml.slice(start, end) }
}

function fieldTokens(xml: string): Token[] {
  const tokens: Token[] = []
  let cursor = 0
  while (cursor < xml.length) {
    const tag = nextTag(xml, cursor)
    if (tag === null) break
    cursor = tag.end
    if (tag.text === '') continue
    if (/^<w:p(?:\s|>)/.test(tag.text)) {
      tokens.push({ start: tag.start, kind: 'p-open', selfClosing: tag.text.endsWith('/>') })
    } else if (/^<\/w:p\s*>/.test(tag.text)) {
      tokens.push({ start: tag.start, kind: 'p-close' })
    } else if (/^<w:fldChar\b/.test(tag.text)) {
      const match = /\bw:fldCharType\s*=\s*(?:"(begin|separate|end)"|'(begin|separate|end)')/.exec(
        tag.text,
      )
      const fieldType = (match?.[1] ?? match?.[2]) as Token['fieldType'] | undefined
      if (fieldType) tokens.push({ start: tag.start, kind: 'field', fieldType })
    }
  }
  return tokens
}

function runBounds(xml: string, at: number): [number, number] | null {
  let open = -1
  let cursor = 0
  while (cursor < at) {
    const tag = nextTag(xml, cursor)
    if (tag === null) break
    cursor = tag.end
    if (tag.text === '' || tag.start >= at) continue
    if (/^<w:r(?:\s|>)/.test(tag.text) && !tag.text.endsWith('/>')) open = tag.start
    else if (/^<\/w:r\s*>/.test(tag.text)) open = -1
  }
  if (open === -1) return null
  let closeCursor = at
  while (closeCursor < xml.length) {
    const tag = nextTag(xml, closeCursor)
    if (tag === null) break
    closeCursor = tag.end
    if (tag.text !== '' && /^<\/w:r\s*>/.test(tag.text)) return [open, tag.end]
  }
  return null
}

export function balanceFieldChars(bodyXml: string): string {
  if (!bodyXml.includes('w:fldCharType')) return bodyXml
  const edits: Edit[] = []
  const open: Array<{ depth: number; paraEnd: number | null }> = []
  let depth = 0
  for (const token of fieldTokens(bodyXml)) {
    if (token.kind === 'p-close') {
      for (const field of open) {
        if (field.depth === depth && field.paraEnd === null) field.paraEnd = token.start
      }
      depth = Math.max(0, depth - 1)
      continue
    }
    if (token.kind === 'p-open') {
      if (!token.selfClosing) depth += 1
      continue
    }
    if (token.fieldType === 'begin') {
      open.push({ depth, paraEnd: null })
    } else if (token.fieldType === 'end' && open.length > 0) {
      open.pop()
    } else {
      if (token.fieldType === 'separate' && open.length > 0) continue
      const bounds = runBounds(bodyXml, token.start)
      if (bounds) edits.push({ start: bounds[0], end: bounds[1], text: '' })
    }
  }
  for (const field of open) {
    const at = field.paraEnd ?? bodyXml.length
    edits.push({ start: at, end: at, text: '<w:r><w:fldChar w:fldCharType="end"/></w:r>' })
  }
  if (edits.length === 0) return bodyXml
  edits.sort((a, b) => b.start - a.start || b.end - a.end)
  let out = bodyXml
  for (const edit of edits) out = out.slice(0, edit.start) + edit.text + out.slice(edit.end)
  return out
}
