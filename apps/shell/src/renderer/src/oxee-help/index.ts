/**
 * OxeeOffice — manual pages that differ from upstream's (fork-owned).
 *
 * Upstream's in-app manual describes a Genspark sign-in, Genspark-hosted
 * models, cloud projects, usage statistics and upstream's own installers.
 * None of that exists in OxeeOffice, and the build-time rename would turn
 * those passages into instructions for an "Oxeegen sign-in" that is not there.
 * The topics below are served from this folder instead: each is upstream's
 * page with only the inaccurate sections rewritten, in English and French.
 * Other languages read the English page here rather than upstream's
 * translation of the wrong text.
 *
 * When upstream rewrites one of these topics, refresh the copy here from its
 * new English and French text (brand/README.md → "The user manual").
 */
import { oxeegenLayerEnabled } from '@genoffice/ai-provider/browser'

const pages = import.meta.glob<string>('./*.md', { query: '?raw', import: 'default' })

/** Topic ids served from here. */
export const OXEE_HELP_TOPICS = ['ai-models', 'home-screen', 'install', 'settings-integrations'] as const

function overridden(id: string): boolean {
  return oxeegenLayerEnabled() && (OXEE_HELP_TOPICS as readonly string[]).includes(id)
}

/** OxeeOffice's body for a topic, or null when upstream's page applies. */
export async function oxeeHelpBody(id: string, langSuffix: string): Promise<string | null> {
  if (!overridden(id)) return null
  const page = pages[`./${id}.${langSuffix}.md`] ?? pages[`./${id}.en.md`]
  return page ? ((await page()) as string) : null
}

/** For an overridden topic: whether this language has its own page; undefined otherwise. */
export function oxeeHelpHasBody(id: string, langSuffix: string): boolean | undefined {
  if (!overridden(id)) return undefined
  return pages[`./${id}.${langSuffix}.md`] !== undefined
}
