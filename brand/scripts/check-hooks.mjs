#!/usr/bin/env node
// Verify every OxeeOffice hook in upstream files is still in place.
//
//   node brand/scripts/check-hooks.mjs
//
// A merge that resolves a conflict in upstream's favour does not fail to
// compile — it silently ships upstream behaviour again (the pre-fork patch
// pipeline shipped broken builds twice that way). This makes a lost hook a
// red CI run instead. Every hook is listed in brand/README.md; keep the two
// in step.

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../..', import.meta.url))
const brand = JSON.parse(readFileSync(join(ROOT, 'brand/config/brand.config.json'), 'utf8'))
const REPO = `${brand.publish.owner}/${brand.publish.repo}`
const UPSTREAM = brand.upstream.repo

/** Each hook: file, strings it must contain, strings it must not. */
const HOOKS = [
  {
    file: 'apps/shell/src/renderer/src/main.tsx',
    why: 'brand stylesheet imported after upstream CSS',
    must: ["import '../../../../../brand/theme/shell.css'"],
  },
  {
    file: 'packages/electron-utils/src/github-menu.ts',
    why: 'Help menu / star CTA repository',
    must: [`GITHUB_REPO_URL = 'https://github.com/${REPO}'`],
  },
  {
    file: 'apps/shell/src/main/index.ts',
    why: 'About page star count',
    must: [`'https://api.github.com/repos/${REPO}'`],
  },
  {
    file: 'apps/shell/src/main/updater.ts',
    why: 'manual download page + stable-only feed',
    must: [
      `DOWNLOAD_PAGE_URL = 'https://github.com/${REPO}/releases/latest'`,
      "{ stable: 'latest', beta: 'latest' }",
    ],
  },
  {
    file: 'apps/shell/src/renderer/src/SettingsModal.tsx',
    why: 'About page repository label',
    must: [`'github.com/${REPO}'`, `\`github.com/${REPO} · ★`],
  },
  {
    file: 'apps/shell/src/renderer/src/IntegrationsPane.tsx',
    why: 'agent skill install source',
    must: [`'npx skills add ${REPO}'`],
  },
  {
    file: 'SECURITY.md',
    why: 'vulnerability reports go to the fork',
    must: [`https://github.com/${REPO}/security/advisories/new`],
  },
  {
    file: '.github/workflows/ci.yml',
    why: "upstream's CI runs in the fork only on demand",
    must: ["if: github.repository == 'genspark-ai/genoffice' || github.event_name == 'workflow_dispatch'"],
  },
  // ── Oxeegen AI layer (packages/ai-provider/src/oxeegen.ts) ──────────────
  {
    file: 'packages/ai-provider/src/types.ts',
    why: 'oxeegen provider ids',
    must: ["| 'oxeegen' // OxeeOffice brand hook", "'oxeegen' | 'genspark' | 'serper' | 'tavily'", 'oxeegen?: { apiKey: string }'],
  },
  {
    file: 'packages/ai-provider/src/providers.ts',
    why: 'Oxeegen chat catalogue, defaults, fallback and settings migration',
    must: ['withOxeegenProviders([', 'return withOxeegenDefaults({', 'return oxeegenFallback(activeProviderUpstream(settings))', 'const stored = migrateToOxeegen(storedRaw)'],
  },
  {
    file: 'packages/ai-provider/src/registry.ts',
    why: 'Oxeegen adapter',
    must: ['= withOxeegenAdapters({'],
  },
  {
    file: 'packages/ai-provider/src/protocols/openai-compatible.ts',
    why: 'Oxeegen requests send no max_tokens (server decides)',
    must: ['omitMaxTokens?: boolean | undefined', '...(options.omitMaxTokens'],
  },
  {
    file: 'packages/ai-provider/src/stream.ts',
    why: 'omitMaxTokens reaches the protocol',
    must: ['omitMaxTokens: endpoint.omitMaxTokens'],
  },
  {
    file: 'packages/ai-provider/src/registry.ts',
    why: 'omitMaxTokens on the resolved endpoint',
    must: ['omitMaxTokens?: boolean'],
  },
  {
    file: 'packages/ai-provider/src/media.ts',
    why: 'Oxeegen media entry and defaults',
    must: ['= withOxeegenMedia([', 'return withOxeegenMediaDefaults({'],
  },
  {
    file: 'packages/ai-provider/src/search-settings.ts',
    why: 'Oxeegen (Brave) search entry and defaults',
    must: ['= withOxeegenSearch([', 'return withOxeegenSearchDefaults({', "['serper', 'tavily', 'oxeegen']"],
  },
  {
    file: 'packages/ai-provider/src/index.ts',
    why: 'Oxeegen layer exported',
    must: ["} from './oxeegen'"],
  },
  {
    file: 'packages/ai-provider/src/browser.ts',
    why: 'Oxeegen layer exported to renderers',
    must: ["} from './oxeegen'", 'isHiddenProvider', 'OXEEGEN_REGIONS', 'oxeegenLayerEnabled'],
  },
  {
    file: 'packages/ai-search/src/index.ts',
    why: 'Brave runs first for the Oxeegen search entry',
    must: ["braveKey: o.braveKey ?? ''", 'await braveWebSearch(o.braveKey, query, maxResults)', 'await braveImageSearch(o.braveKey, query, maxResults)'],
  },
  {
    file: 'packages/ai-search/src/search-tools.ts',
    why: 'Oxeegen search entry routes to Brave',
    must: ["braveKey: settings.search!.providers.oxeegen?.apiKey ?? ''", "provider === 'oxeegen' && r.method === 'brave'"],
  },
  {
    file: 'packages/ai-search/src/gsk.ts',
    why: 'no Genspark sign-in or Genspark CLI key',
    must: ["if (oxeegenLayerEnabled()) return ''"],
  },
  {
    file: 'apps/shell/src/preload/index.ts',
    why: 'Genspark sign-in provider not offered',
    must: ['AI_PROVIDERS.filter((meta) => !isHiddenProvider(meta.id))'],
  },
  {
    file: 'apps/shell/src/renderer/src/SettingsModal.tsx',
    why: 'no Account page, region buttons, no cloud-tools switch, Brave hint',
    must: ["initialSettingsSection('account')", 'visibleSettingsSections(SECTIONS)', 'id="set-ai-region"', 'id={`set-ai-${cap}-region`}', '{!oxeegenLayerEnabled() && (', '? OXEEGEN_SEARCH_HINT', '? OXEEGEN_CHAT_HINT', "{provider !== 'oxeegen' && ("],
  },
  {
    file: 'apps/shell/src/renderer/src/Onboarding.tsx',
    why: 'no GenTeam/credits slide, no analytics notice on first run',
    must: ['const SLIDES: readonly Slide[] = brandOnboardingSlides(['],
  },
  {
    file: 'apps/shell/src/renderer/src/SettingsModal.tsx',
    why: 'no analytics switch in General',
    must: ['{/* OxeeOffice brand hook: no analytics to switch off (PRIVACY.md), so no switch */}'],
  },
  {
    file: 'apps/shell/src/renderer/src/Home.tsx',
    why: 'sidebar button is Settings, not Genspark sign-in',
    must: ['const settingsOnly = oxeegenLayerEnabled()', '<SettingsGlyph />'],
  },
  {
    file: 'apps/shell/src/renderer/src/provider-logos.tsx',
    why: 'Oxeegen provider logo',
    must: ['oxeegen: ('],
  },
  {
    file: 'apps/shell/tests/privacy-doc.test.ts',
    why: 'privacy test asserts the no-analytics statement',
    must: ['sends no usage analytics'],
  },
  // ── Model picker and Oxee mark in the editors (packages/ui/src/oxee-model-picker.tsx) ──
  {
    file: 'packages/ui/src/index.ts',
    why: 'picker and mark exported',
    must: ["} from './oxee-model-picker'", "export { OXEE_MARK_DATA_URI } from './oxee-mark'"],
  },
  {
    file: 'packages/ui/src/dropdown.css',
    why: 'picker sizing',
    must: ['.oxee-model-picker {'],
  },
  ...[
    ['apps/docs/src/renderer/ai/AiPanel.tsx', 'desktop'],
    ['apps/sheets/src/renderer/ai/AiChatPanel.tsx', 'desktopApi'],
    ['apps/slides/src/renderer/ai/AiPanel.tsx', 'slidesApi'],
    ['apps/pdf/src/renderer/ai/AiPanel.tsx', 'pdfApi'],
    ['apps/markdown/src/renderer/ai/AiPanel.tsx', 'markdownApi'],
    ['apps/html/src/renderer/ai/AiPanel.tsx', 'htmlApi'],
  ].map(([file, api]) => ({
    file,
    why: 'model picker in the AI panel header',
    must: ['<OxeeModelPicker', `save={(s) => window.${api}.setAiSettings(`],
  })),
  ...[
    'apps/docs/src/renderer/components/icons.tsx',
    'apps/sheets/src/renderer/ribbon-icons.tsx',
    'apps/slides/src/renderer/components/icons.tsx',
    'apps/pdf/src/renderer/ai/AiPanel.tsx',
    'apps/markdown/src/renderer/ai/AiPanel.tsx',
    'apps/html/src/renderer/ai/AiPanel.tsx',
  ].map((file) => ({ file, why: 'Oxee mark in place of the Genspark mark', must: ['if (oxeegenLayerEnabled()) return <OxeeMark size={size} />'] })),
  ...['apps/docs/src/renderer/App.tsx', 'apps/sheets/src/renderer/App.tsx', 'apps/slides/src/renderer/App.tsx'].map((file) => ({
    file,
    why: 'follow model changes made in other tabs',
    must: ['useAiSettingsRefresh(refreshAiSettings)'],
  })),
  ...['pdf', 'markdown', 'html'].flatMap((app) => [
    { file: `apps/${app}/src/preload/index.ts`, why: 'picker can save', must: ["setAiSettings: (settings: unknown) => ipcRenderer.invoke('ai:set-settings', settings)"] },
    { file: `apps/${app}/src/shared/ipc.ts`, why: 'picker can save (type)', must: ['setAiSettings(settings: unknown): Promise<void>'] },
  ]),
  {
    file: 'apps/slides/src/renderer/ai/AiPanel.tsx',
    why: 'deck generation uses the model in the picker (no swap to a larger model)',
    must: ['if (oxeegenLayerEnabled()) return cur'],
  },
  {
    file: 'apps/markdown/src/renderer/styles.css',
    why: 'wider Markdown page',
    must: ['/* OxeeOffice brand hook: 860px squeezed tables into tall, narrow cells */\n  max-width: 90%;'],
  },
  // upstream tests updated to assert what ships
  {
    file: 'apps/shell/tests/updater.test.ts',
    why: 'tests follow the updater hooks',
    must: [`'https://github.com/${REPO}/releases/latest'`],
  },
  {
    file: 'apps/shell/tests/settings-integrations.test.ts',
    why: 'test follows the skill-install hook',
    must: [`'npx skills add ${REPO}'`],
  },
]

/** Fork-owned files the hooks import; a merge must never lose them. */
const FORK_FILES = [
  'packages/ai-provider/src/oxeegen.ts',
  'packages/ai-provider/tests/oxeegen.test.ts',
  'packages/ai-search/src/brave.ts',
  'packages/ai-search/tests/oxeegen-search.test.ts',
  'apps/shell/src/renderer/src/oxeegen-settings.tsx',
  'packages/ui/src/oxee-model-picker.tsx',
  'packages/ui/src/oxee-mark.ts',
  'apps/shell/electron-builder.brand.cjs',
]

const problems = []
for (const f of FORK_FILES) {
  try { readFileSync(join(ROOT, f)) } catch { problems.push(`${f}: fork-owned file missing`) }
}
for (const h of HOOKS) {
  let text
  try {
    text = readFileSync(join(ROOT, h.file), 'utf8')
  } catch {
    problems.push(`${h.file}: file missing (${h.why})`)
    continue
  }
  for (const s of h.must) if (!text.includes(s)) problems.push(`${h.file}: lost hook (${h.why}) — expected ${s}`)
}

// New upstream references to its own repository inside string literals of
// shipped source. Comments (issue links like genspark-ai/genoffice#135) are fine.
const literalRef = new RegExp(`['"\`][^'"\`\\n]*${UPSTREAM.replace('/', '\\/')}`)
function* sources(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === 'out' || e.name === 'dist' || e.name === 'tests' || e.name === '__tests__') continue
    const p = join(dir, e.name)
    if (e.isDirectory()) yield* sources(p)
    else if (/\.(ts|tsx)$/.test(e.name) && !/\.(test|spec)\.tsx?$/.test(e.name)) yield p
  }
}
for (const top of ['apps', 'packages']) {
  for (const p of sources(join(ROOT, top))) {
    const lines = readFileSync(p, 'utf8').split('\n')
    lines.forEach((line, i) => {
      const code = line.replace(/\/\/.*$/, '')
      if (literalRef.test(code)) problems.push(`${relative(ROOT, p).split(sep).join('/')}:${i + 1}: new reference to ${UPSTREAM}`)
    })
  }
}

if (problems.length) {
  console.error('check-hooks: brand hooks missing or new upstream references:')
  for (const p of problems) console.error('  ' + p)
  console.error('Re-apply the hook (brand/README.md lists each one) or add a new one.')
  process.exit(1)
}
console.log(`check-hooks: ok (${HOOKS.length} hooks, no stray ${UPSTREAM} references)`)
