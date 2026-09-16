/**
 * OxeeOffice — the Oxeegen AI layer.
 *
 * Fork-owned file: upstream never has it, so merges never conflict here.
 * Upstream files reach it through small hooks marked "OxeeOffice brand hook"
 * (listed in brand/README.md, verified by brand/scripts/check-hooks.mjs).
 *
 * Oxeegen replaces upstream's Genspark sign-in provider as the default for
 * chat, image/video analysis and web search. It is deliberately an ordinary
 * own-key provider: upstream's generic path then handles the settings fields,
 * key checks, the Test button and error messages, and every Genspark-specific
 * branch (`provider === 'genspark'`) simply never runs — stored `genspark`
 * selections are migrated to `oxeegen` when settings are read.
 */

import type {
  AiMediaProviderMeta,
  AiMediaSettings,
  AiProviderConfig,
  AiProviderId,
  AiProviderMeta,
  AiSearchProviderMeta,
  AiSearchSettings,
  AiSettings,
  LegacyAiSettings,
} from './types'
import type { ProviderAdapter, ResolvedEndpoint } from './registry'

/**
 * The layer is off under upstream's own test runner, so upstream's suites
 * keep asserting upstream's defaults and merges never touch their test files.
 * tests/oxeegen.test.ts sets OXEEGEN_LAYER=1 to test what OxeeOffice ships.
 */
export function oxeegenLayerEnabled(): boolean {
  // Read `process` through a computed name. Bundlers pattern-match the
  // spelling process.env and rewrite `globalThis.process?.env` into
  // `globalThis.process.env`, which throws in a sandboxed preload (no
  // globalThis.process) and took the whole shell preload down.
  const proc = (globalThis as Record<string, unknown>)['proc' + 'ess'] as
    | { env?: Record<string, string | undefined> }
    | undefined
  const env = proc && typeof proc === 'object' ? proc.env : undefined
  if (env?.OXEEGEN_LAYER === '1') return true
  return !env?.VITEST
}

// ── Endpoints and models ────────────────────────────────────────────────────

/** Region endpoints offered as one-click choices next to the base URL field. */
export const OXEEGEN_REGIONS = [
  { id: 'us', label: 'US', baseUrl: 'https://inference-02.oxeegen.com/v1' },
  { id: 'eu', label: 'EU', baseUrl: 'https://inference-04.oxeegen.com/v1' },
] as const

export const OXEEGEN_DEFAULT_BASE_URL: string = OXEEGEN_REGIONS[0].baseUrl

/** Chat models offered in the pickers, largest first. */
export const OXEEGEN_CHAT_MODELS = ['Oxee-max', 'Oxee-pro', 'Oxee-flash', 'Oxee-instant']
export const OXEEGEN_DEFAULT_MODEL = 'Oxee-max'

/** Models that read images and video: all of them (Max verified 2026-09-16). */
export const OXEEGEN_VISION_MODELS = ['Oxee-max', 'Oxee-pro', 'Oxee-flash', 'Oxee-instant']
export const OXEEGEN_DEFAULT_VISION_MODEL = 'Oxee-pro'

// ── Tiers ───────────────────────────────────────────────────────────────────

/**
 * Bulk steps that carry out a plan the picked model already wrote run on the
 * fast worker model (reasoning off): Slides page specs, written from the
 * outline, and chat-compaction summaries. Everything else (the chat agent,
 * Slides style and outline, the Slides layout-fix agent, the Docs / Markdown /
 * HTML writers) uses the model in the picker.
 */
export const OXEEGEN_WORKER_MODEL = 'Oxee-instant'

/** Slides pages generated at once on the worker model (upstream generates 2). */
export const OXEEGEN_DECK_PAGE_CONCURRENCY = 4

type SettingsWithModels = { provider: string; providers: { [id: string]: { model: string } | undefined } }

/** A copy of the settings on the worker model, or null when Oxeegen is not the provider. */
export function oxeegenWorkerSettings<S extends SettingsWithModels>(settings: S): S | null {
  if (!oxeegenLayerEnabled() || settings.provider !== 'oxeegen') return null
  const config = settings.providers.oxeegen
  if (!config) return null
  return { ...settings, providers: { ...settings.providers, oxeegen: { ...config, model: OXEEGEN_WORKER_MODEL } } }
}

/** Slides page-generation concurrency, or undefined to keep upstream's. */
export function oxeegenDeckPageConcurrency(settings: { provider: string }): number | undefined {
  return oxeegenLayerEnabled() && settings.provider === 'oxeegen' ? OXEEGEN_DECK_PAGE_CONCURRENCY : undefined
}

/** Main-process `ai:stream` routing: compaction summaries go to the worker model. */
export function oxeegenRouteStreamRequest<R extends { purpose?: string; settings: SettingsWithModels }>(request: R): R {
  if (request.purpose !== 'compaction') return request
  const settings = oxeegenWorkerSettings(request.settings)
  return settings ? { ...request, settings } : request
}

// ── Chat ────────────────────────────────────────────────────────────────────

export const OXEEGEN_PROVIDER: AiProviderMeta = {
  id: 'oxeegen',
  label: 'Oxeegen',
  models: OXEEGEN_CHAT_MODELS,
  defaultModel: OXEEGEN_DEFAULT_MODEL,
  keyPlaceholder: 'Oxeegen API key',
}

/** Upstream's sign-in provider: kept in the catalogue so old ids still resolve, never offered. */
export function isHiddenProvider(id: string): boolean {
  return oxeegenLayerEnabled() && id === 'genspark'
}

/** Chat catalogue with Oxeegen first. */
export function withOxeegenProviders(list: AiProviderMeta[]): AiProviderMeta[] {
  return oxeegenLayerEnabled() ? [OXEEGEN_PROVIDER, ...list] : list
}

/**
 * Oxeegen's models are tuned server-side (vLLM generation config: sampling,
 * reasoning, output length). Upstream sends a hard-coded `temperature: 0.3` and
 * a `max_tokens` cap (the Max output tokens setting, 16,384 for Slides pages)
 * on every OpenAI-compatible request; for Oxeegen those overrides caused
 * problems (Oxeegen, 2026-09-16), so neither is sent. No reasoning parameter
 * was ever sent. Requests carry only model, messages, tools and stream.
 */
function oxeegenEndpoint(config: AiProviderConfig): ResolvedEndpoint {
  return {
    protocol: 'openai-compatible',
    baseUrl: config.baseUrl?.trim() || OXEEGEN_DEFAULT_BASE_URL,
    omitTemperature: true,
    omitMaxTokens: true,
  }
}

/**
 * Adds the Oxeegen adapter. The Genspark adapter is also pointed at Oxeegen:
 * nothing should reach it after migration, but if a stray `genspark` id ever
 * does, it must not send the user's data to Genspark's proxy.
 */
export function withOxeegenAdapters(
  adapters: Record<Exclude<AiProviderId, 'oxeegen'>, ProviderAdapter>,
): Record<AiProviderId, ProviderAdapter> {
  if (!oxeegenLayerEnabled()) return adapters as Record<AiProviderId, ProviderAdapter>
  return {
    ...adapters,
    genspark: { ...adapters.genspark, capabilities: { auth: 'api-key', vision: true }, resolveEndpoint: oxeegenEndpoint },
    oxeegen: {
      meta: OXEEGEN_PROVIDER,
      capabilities: { auth: 'api-key', vision: true },
      resolveEndpoint: oxeegenEndpoint,
    },
  }
}

/** Upstream falls back to `genspark` for any unusable selection; OxeeOffice falls back to Oxeegen. */
export function oxeegenFallback(id: AiProviderId): AiProviderId {
  return oxeegenLayerEnabled() && id === 'genspark' ? 'oxeegen' : id
}

export function withOxeegenDefaults(settings: AiSettings): AiSettings {
  if (!oxeegenLayerEnabled()) return settings
  return {
    ...settings,
    provider: 'oxeegen',
    providers: {
      ...settings.providers,
      oxeegen: { apiKey: '', model: OXEEGEN_DEFAULT_MODEL, baseUrl: OXEEGEN_DEFAULT_BASE_URL },
    },
  }
}

// ── Media (image / video analysis) ──────────────────────────────────────────

export const OXEEGEN_MEDIA_PROVIDER: AiMediaProviderMeta = {
  id: 'oxeegen',
  label: 'Oxeegen',
  description: 'Oxeegen vision models read images and video',
  keyPlaceholder: 'Oxeegen API key',
  defaultBaseUrl: OXEEGEN_DEFAULT_BASE_URL,
  // no imageProtocol: Oxeegen serves no image model yet, so image generation
  // stays with the providers that have one (OpenAI by default)
  imageModels: [],
  defaultImageModel: '',
  analysisProtocol: 'openai-chat',
  analysisModels: OXEEGEN_VISION_MODELS,
  defaultAnalysisModel: OXEEGEN_DEFAULT_VISION_MODEL,
  videoAnalysis: true,
}

/** Media catalogue: Oxeegen first, the Genspark sign-in entry removed. */
export function withOxeegenMedia(list: AiMediaProviderMeta[]): AiMediaProviderMeta[] {
  if (!oxeegenLayerEnabled()) return list
  return [OXEEGEN_MEDIA_PROVIDER, ...list.filter((m) => m.id !== 'genspark')]
}

export function withOxeegenMediaDefaults(media: AiMediaSettings): AiMediaSettings {
  if (!oxeegenLayerEnabled()) return media
  return {
    ...media,
    imageProvider: 'openai',
    analysisProvider: 'oxeegen',
    videoAnalysisProvider: 'oxeegen',
    providers: {
      ...media.providers,
      oxeegen: {
        apiKey: '',
        imageModel: '',
        analysisModel: OXEEGEN_DEFAULT_VISION_MODEL,
        baseUrl: OXEEGEN_DEFAULT_BASE_URL,
      },
    },
  }
}

// ── Search (Brave, behind the Oxeegen entry) ────────────────────────────────

/**
 * For now the Oxeegen search entry is backed by the Brave Search API: its key
 * field takes a Brave key (Oxeegen's decision, 2026-09-16), until Oxeegen
 * serves search itself.
 */
export const OXEEGEN_SEARCH_PROVIDER: AiSearchProviderMeta = {
  id: 'oxeegen',
  label: 'Oxeegen',
  keyPlaceholder: 'Brave Search API key',
  imageSearch: true,
}

export function withOxeegenSearch(list: AiSearchProviderMeta[]): AiSearchProviderMeta[] {
  if (!oxeegenLayerEnabled()) return list
  return [OXEEGEN_SEARCH_PROVIDER, ...list.filter((m) => m.id !== 'genspark')]
}

export function withOxeegenSearchDefaults(search: AiSearchSettings): AiSearchSettings {
  if (!oxeegenLayerEnabled()) return search
  return { provider: 'oxeegen', providers: { ...search.providers, oxeegen: { apiKey: '' } } }
}

// ── Migration of stored settings ────────────────────────────────────────────

type StoredSettings = Partial<AiSettings> & LegacyAiSettings

/**
 * Moves stored Genspark selections onto Oxeegen before upstream resolves the
 * file. Pure; returns the input unchanged when there is nothing to migrate.
 *
 * - OxeeOffice ≤ 0.9.431 kept the Oxeegen chat config under `genspark`
 *   (key, base URL, Oxee model): it is copied to `oxeegen` unless that already
 *   holds a key.
 * - Media and search selections of `genspark` meant "the sign-in", which does
 *   not exist here: analysis/video/search go to Oxeegen, images to OpenAI.
 * - Empty Oxeegen base URLs are filled with the default region, so the field
 *   is never blank in Settings.
 */
export function migrateToOxeegen<T extends StoredSettings>(stored: T): T {
  if (!oxeegenLayerEnabled() || !stored || typeof stored !== 'object') return stored
  const out: StoredSettings = { ...stored }

  if (!out.provider || out.provider === 'genspark') out.provider = 'oxeegen'

  if (out.providers) {
    const providers = { ...out.providers }
    const legacy = providers.genspark
    const current = providers.oxeegen
    if (legacy?.apiKey?.trim() && !current?.apiKey?.trim()) {
      providers.oxeegen = {
        apiKey: legacy.apiKey.trim(),
        model: /^oxee-/i.test(legacy.model ?? '') ? legacy.model : OXEEGEN_DEFAULT_MODEL,
        baseUrl: legacy.baseUrl?.trim() || OXEEGEN_DEFAULT_BASE_URL,
      }
    }
    if (providers.oxeegen && !providers.oxeegen.baseUrl?.trim()) {
      providers.oxeegen = { ...providers.oxeegen, baseUrl: OXEEGEN_DEFAULT_BASE_URL }
    }
    out.providers = providers
  }

  if (out.media) {
    const media = { ...out.media }
    if (media.imageProvider === 'genspark') media.imageProvider = 'openai'
    if (media.analysisProvider === 'genspark') media.analysisProvider = 'oxeegen'
    if (media.videoAnalysisProvider === 'genspark') media.videoAnalysisProvider = 'oxeegen'
    const oxee = media.providers?.oxeegen
    if (oxee && !oxee.baseUrl?.trim()) {
      media.providers = { ...media.providers, oxeegen: { ...oxee, baseUrl: OXEEGEN_DEFAULT_BASE_URL } }
    }
    out.media = media
  }

  if (out.search && out.search.provider === 'genspark') {
    out.search = { ...out.search, provider: 'oxeegen' }
  }

  return out as T
}
