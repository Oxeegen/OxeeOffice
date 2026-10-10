// OxeeOffice: the user manual serves OxeeOffice's own pages where upstream's
// describe a Genspark sign-in, cloud projects, usage statistics or upstream's
// installers.
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { HELP_TOPICS, helpBody, helpHasBody, helpImage } from '../src/renderer/src/i18n/help/help-registry'
import { OXEE_HELP_TOPICS } from '../src/renderer/src/oxee-help'

const DIR = join(__dirname, '../src/renderer/src/oxee-help')

beforeAll(() => vi.stubEnv('OXEEGEN_LAYER', '1'))
afterAll(() => vi.unstubAllEnvs())

describe("OxeeOffice's manual pages", () => {
  it('cover real topics, in English and French, without upstream names or links', () => {
    for (const id of OXEE_HELP_TOPICS) {
      expect(HELP_TOPICS.some((t) => t.id === id)).toBe(true)
      for (const lang of ['en', 'fr']) {
        const text = readFileSync(join(DIR, `${id}.${lang}.md`), 'utf8')
        expect(text).not.toMatch(/Genspark|GenOffice|genspark-ai|sign-in|Sign in|Google Analytics|anonymous usage statistics|statistiques d.utilisation anonymes/)
      }
    }
    expect(readdirSync(DIR).filter((f) => f.endsWith('.md'))).toHaveLength(OXEE_HELP_TOPICS.length * 2)
  })

  it('replace upstream for those topics, falling back to English for other languages', async () => {
    const en = await helpBody('install', 'en')
    expect(en).toContain('github.com/Oxeegen/OxeeOffice/releases')
    expect(await helpBody('install', 'fr')).toContain('Installer OxeeOffice')
    expect(await helpBody('install', 'de')).toBe(en)
    expect(helpHasBody('install', 'fr')).toBe(true)
    expect(helpHasBody('install', 'de')).toBe(false)
    expect(await helpBody('home-screen', 'ja')).not.toMatch(/Genspark/)
  })

  it('leave every other topic to upstream', async () => {
    const docs = await helpBody('docs', 'en')
    expect(docs).toBe(readFileSync(join(__dirname, '../src/renderer/src/i18n/help/topics/docs.en.md'), 'utf8'))
  })

  it('only reference figures the manual ships', () => {
    for (const id of OXEE_HELP_TOPICS) {
      const text = readFileSync(join(DIR, `${id}.en.md`), 'utf8')
      for (const [, href] of text.matchAll(/\]\((img\/[^)]+)\)/g)) expect(helpImage(href!, 'en')).toBeTruthy()
    }
  })
})
