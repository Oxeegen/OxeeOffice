/**
 * Resolve an OPC relationship target against the part that owns the .rels.
 * Some Windows producers emit backslash separators; OPC uses forward slashes,
 * so normalize before splitting. `..` is clamped at the zip root so a hostile
 * `../../..` chain cannot read as a deeper traversal than root.
 */
export function resolveTarget(basePart: string, target: string): string {
  if (/^[A-Za-z][A-Za-z0-9+.-]*:/.test(target)) return ''
  let decoded: string
  try {
    decoded = decodeURIComponent(target)
  } catch {
    return ''
  }
  const baseSlash = basePart.lastIndexOf('/')
  const parts = decoded.startsWith('/')
    ? []
    : (baseSlash >= 0 ? basePart.slice(0, baseSlash) : '').split('/').filter(Boolean)
  for (const seg of decoded.replace(/\\/g, '/').split('/')) {
    if (seg === '.' || seg === '') continue
    if (seg === '..') {
      if (parts.length > 0) parts.pop()
    } else parts.push(seg)
  }
  return parts.join('/')
}
