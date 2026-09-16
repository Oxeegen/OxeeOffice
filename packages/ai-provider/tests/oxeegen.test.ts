// OxeeOffice — tests for the Oxeegen layer (fork-owned).
//
// The layer is off under vitest so upstream's suites keep asserting upstream's
// defaults (see oxeegenLayerEnabled). Here it is switched on and the modules
// are re-imported, so these tests exercise exactly what OxeeOffice ships.

import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

type Api = typeof import('../src/index')
let api: Api

beforeAll(async () => {
  vi.stubEnv('OXEEGEN_LAYER', '1')
  vi.resetModules()
  api = await import('../src/index')
})

afterAll(() => {
  vi.unstubAllEnvs()
  vi.resetModules()
})

const US = 'https://inference-02.oxeegen.com/v1'
const EU = 'https://inference-04.oxeegen.com/v1'

describe('Oxeegen chat provider', () => {
  it('is first in the catalogue with Max as the default model', () => {
    const [first] = api.AI_PROVIDERS
    expect(first?.id).toBe('oxeegen')
    expect(first?.label).toBe('Oxeegen')
    expect(first?.models).toEqual(['Oxee-max', 'Oxee-pro', 'Oxee-flash', 'Oxee-instant'])
    expect(first?.defaultModel).toBe('Oxee-max')
  })

  it('offers US and EU endpoints, US by default', () => {
    expect(api.OXEEGEN_REGIONS.map((r) => [r.label, r.baseUrl])).toEqual([
      ['US', US],
      ['EU', EU],
    ])
    expect(api.OXEEGEN_DEFAULT_BASE_URL).toBe(US)
  })

  it('hides the Genspark sign-in provider but keeps it resolvable', () => {
    expect(api.isHiddenProvider('genspark')).toBe(true)
    expect(api.isHiddenProvider('oxeegen')).toBe(false)
    expect(api.AI_PROVIDERS.some((m) => m.id === 'genspark')).toBe(true)
  })

  it('keeps upstream’s registry invariant: one adapter per catalogue entry', () => {
    expect(Object.keys(api.AI_PROVIDER_ADAPTERS).sort()).toEqual(api.AI_PROVIDERS.map((m) => m.id).sort())
  })

  it('talks OpenAI-compatible to the configured region, US when blank', () => {
    const adapter = api.getProviderAdapter('oxeegen')
    expect(adapter.capabilities.auth).toBe('api-key')
    const cfg = (baseUrl?: string) => ({ apiKey: 'k', model: 'Oxee-max', baseUrl })
    const shaped = { omitTemperature: true, omitMaxTokens: true }
    expect(adapter.resolveEndpoint(cfg())).toEqual({ protocol: 'openai-compatible', baseUrl: US, ...shaped })
    expect(adapter.resolveEndpoint(cfg(''))).toEqual({ protocol: 'openai-compatible', baseUrl: US, ...shaped })
    expect(adapter.resolveEndpoint(cfg(EU))).toEqual({ protocol: 'openai-compatible', baseUrl: EU, ...shaped })
  })

  it('never routes a stray genspark id to Genspark’s proxy', () => {
    for (const model of ['claude-opus-4-7', 'gpt-5.6-terra', 'Oxee-max']) {
      const endpoint = api.getProviderAdapter('genspark').resolveEndpoint({ apiKey: 'k', model })
      expect(endpoint.baseUrl).toBe(US)
      expect(endpoint.baseUrl).not.toMatch(/genspark/)
    }
  })

  it('treats every Oxee model as able to read images', () => {
    for (const model of api.OXEEGEN_CHAT_MODELS) expect(api.modelLacksVision(model)).toBe(false)
    expect(api.OXEEGEN_VISION_MODELS).toEqual(api.OXEEGEN_CHAT_MODELS)
  })
})

describe('request bodies: the server configuration decides', () => {
  // Oxeegen models are tuned in vLLM; upstream's hard-coded temperature 0.3 and
  // max_tokens caps caused problems, so Oxeegen requests carry neither.
  function captureFetch() {
    const bodies: Record<string, unknown>[] = []
    vi.stubGlobal(
      'fetch',
      vi.fn(async (_url: string, init?: RequestInit) => {
        const body = JSON.parse(String(init?.body ?? '{}')) as Record<string, unknown>
        bodies.push(body)
        if (body.stream) {
          const sse = 'data: {"choices":[{"delta":{"content":"OK"},"finish_reason":"stop"}]}\n\ndata: [DONE]\n\n'
          return new Response(sse, { status: 200, headers: { 'Content-Type': 'text/event-stream' } })
        }
        return new Response(JSON.stringify({ choices: [{ message: { content: 'OK' }, finish_reason: 'stop' }] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      }),
    )
    return bodies
  }
  const cb = { onDelta() {}, onToolCall() {} }
  const tool = { name: 't', description: 'd', inputSchema: { type: 'object', properties: {} } }

  it('Oxeegen streams and one-shot calls send no temperature and no max_tokens', async () => {
    const bodies = captureFetch()
    try {
      const config = { apiKey: 'k', model: 'Oxee-max', baseUrl: US }
      await api.streamForProvider('oxeegen', config, 'sys', [{ role: 'user', text: 'hi' }] as never, [tool] as never, 32768, cb as never)
      await api.streamForProvider('oxeegen', config, 'sys', [{ role: 'user', text: 'page' }] as never, [], 16384, cb as never)
      await api.chatForProvider('oxeegen', config, 'sys', 'ping')
    } finally {
      vi.unstubAllGlobals()
    }
    expect(bodies).toHaveLength(3)
    for (const body of bodies) {
      expect(body).not.toHaveProperty('temperature')
      expect(body).not.toHaveProperty('max_tokens')
      expect(body).not.toHaveProperty('max_completion_tokens')
      expect(body).not.toHaveProperty('reasoning_effort')
      expect(body.model).toBe('Oxee-max')
    }
    expect(Object.keys(bodies[0]!).sort()).toEqual(['messages', 'model', 'stream', 'tools'])
    expect(Object.keys(bodies[2]!).sort()).toEqual(['messages', 'model'])
  })

  it('other OpenAI-compatible providers still send upstream’s fields', async () => {
    const bodies = captureFetch()
    try {
      await api.streamForProvider('mistral', { apiKey: 'k', model: 'mistral-medium-latest' }, 'sys', [{ role: 'user', text: 'hi' }] as never, [], 4096, cb as never)
    } finally {
      vi.unstubAllGlobals()
    }
    expect(bodies[0]).toMatchObject({ temperature: 0.3, max_tokens: 4096 })
  })
})

describe('tiers', () => {
  const with_ = (provider: string, model: string) => ({
    provider,
    providers: { oxeegen: { apiKey: 'k', model, baseUrl: EU }, anthropic: { apiKey: 'a', model: 'claude-sonnet-5' } },
  })

  it('keeps the picked model and turns reasoning off for steps that carry out a plan', () => {
    for (const model of api.OXEEGEN_CHAT_MODELS) {
      for (const role of ['deckPages', 'layoutCheck', 'writer'] as const) {
        expect(api.oxeegenRoleSettings(with_('oxeegen', model), role)?.providers.oxeegen).toEqual({
          apiKey: 'k',
          model,
          baseUrl: EU,
          thinking: false,
        })
      }
    }
  })

  it('runs compaction summaries on Instant', () => {
    expect(api.oxeegenRoleSettings(with_('oxeegen', 'Oxee-max'), 'compaction')?.providers.oxeegen).toEqual({
      apiKey: 'k',
      model: 'Oxee-instant',
      baseUrl: EU,
    })
  })

  it('leaves other providers alone and never mutates the settings', () => {
    expect(api.oxeegenRoleSettings(with_('anthropic', 'claude-sonnet-5'), 'deckPages')).toBeNull()
    const s = with_('oxeegen', 'Oxee-max')
    api.oxeegenRoleSettings(s, 'layoutCheck')
    expect(s.providers.oxeegen).toEqual({ apiKey: 'k', model: 'Oxee-max', baseUrl: EU })
  })

  it('turns thinking: false into the vLLM chat-template switch, and nothing otherwise', () => {
    const adapter = api.getProviderAdapter('oxeegen')
    expect(adapter.resolveEndpoint({ apiKey: 'k', model: 'Oxee-max', thinking: false }).bodyExtras).toEqual({
      chat_template_kwargs: { enable_thinking: false },
    })
    expect(adapter.resolveEndpoint({ apiKey: 'k', model: 'Oxee-max' }).bodyExtras).toBeUndefined()
    expect(adapter.resolveEndpoint({ apiKey: 'k', model: 'Oxee-max', thinking: true }).bodyExtras).toBeUndefined()
  })

  it('a reasoning-off request carries the switch and still no temperature or max_tokens', async () => {
    const bodies: Record<string, unknown>[] = []
    vi.stubGlobal(
      'fetch',
      vi.fn(async (_url: string, init?: RequestInit) => {
        bodies.push(JSON.parse(String(init?.body ?? '{}')) as Record<string, unknown>)
        const sse = 'data: {"choices":[{"delta":{"content":"OK"},"finish_reason":"stop"}]}\n\ndata: [DONE]\n\n'
        return new Response(sse, { status: 200, headers: { 'Content-Type': 'text/event-stream' } })
      }),
    )
    try {
      const settings = api.oxeegenRoleSettings(with_('oxeegen', 'Oxee-max'), 'deckPages')!
      await api.streamForProvider('oxeegen', settings.providers.oxeegen, 'sys', [{ role: 'user', text: 'page' }] as never, [], 16384, {
        onDelta() {},
        onToolCall() {},
      } as never)
    } finally {
      vi.unstubAllGlobals()
    }
    expect(bodies[0]).toMatchObject({ model: 'Oxee-max', chat_template_kwargs: { enable_thinking: false } })
    expect(bodies[0]).not.toHaveProperty('temperature')
    expect(bodies[0]).not.toHaveProperty('max_tokens')
    expect(bodies[0]).not.toHaveProperty('thinking')
  })

  it('writes Slides pages one at a time with references, on Oxeegen only', () => {
    expect(api.oxeegenDeckPageConcurrency({ provider: 'oxeegen' })).toBe(1)
    expect(api.oxeegenDeckPageReferences({ provider: 'oxeegen' })).toBe(true)
    expect(api.oxeegenDeckPageConcurrency({ provider: 'anthropic' })).toBeUndefined()
    expect(api.oxeegenDeckPageReferences({ provider: 'anthropic' })).toBe(false)
  })

  it('routes compaction requests to Instant and nothing else', () => {
    const base = { requestId: 'r', system: 's', messages: [], settings: with_('oxeegen', 'Oxee-max') }
    expect(api.oxeegenRouteStreamRequest({ ...base, purpose: 'compaction' as const }).settings.providers.oxeegen?.model).toBe(
      'Oxee-instant',
    )
    const chat = api.oxeegenRouteStreamRequest(base)
    expect(chat).toBe(base)
    const other = { ...base, purpose: 'compaction' as const, settings: with_('anthropic', 'claude-sonnet-5') }
    expect(api.oxeegenRouteStreamRequest(other)).toBe(other)
  })
})

describe('defaults for a fresh install', () => {
  it('selects Oxeegen with the endpoint pre-filled', () => {
    const s = api.defaultAiSettings()
    expect(s.provider).toBe('oxeegen')
    expect(s.providers.oxeegen).toEqual({ apiKey: '', model: 'Oxee-max', baseUrl: US })
  })

  it('sends images to OpenAI and analysis to Oxeegen, endpoint pre-filled', () => {
    const media = api.defaultAiSettings().media!
    expect(media.imageProvider).toBe('openai')
    expect(media.analysisProvider).toBe('oxeegen')
    expect(media.videoAnalysisProvider).toBe('oxeegen')
    expect(media.providers.oxeegen).toEqual({
      apiKey: '',
      imageModel: '',
      analysisModel: 'Oxee-pro',
      baseUrl: US,
    })
    expect(media.providers.openai?.imageModel).toBe('gpt-image-2.5-flare')
  })

  it('searches through the Oxeegen entry', () => {
    const search = api.defaultAiSettings().search!
    expect(search.provider).toBe('oxeegen')
    expect(search.providers.oxeegen).toEqual({ apiKey: '' })
  })

  it('falls back to Oxeegen when a selection is unusable', () => {
    const s = api.defaultAiSettings()
    expect(api.activeProvider({ ...s, provider: 'anthropic' })).toBe('oxeegen')
    expect(api.activeProvider({ ...s, provider: 'genspark' })).toBe('oxeegen')
  })
})

describe('catalogues', () => {
  it('media: Oxeegen replaces the sign-in entry, for analysis and video but not images', () => {
    const ids = api.AI_MEDIA_PROVIDERS.map((m) => m.id)
    expect(ids[0]).toBe('oxeegen')
    expect(ids).not.toContain('genspark')
    const oxee = api.getMediaProviderMeta('oxeegen')!
    expect(api.providerHasCapability(oxee, 'analysis')).toBe(true)
    expect(api.providerHasCapability(oxee, 'video')).toBe(true)
    expect(api.providerHasCapability(oxee, 'image')).toBe(false)
    expect(oxee.analysisModels).toEqual(['Oxee-max', 'Oxee-pro', 'Oxee-flash', 'Oxee-instant'])
  })

  it('search: Oxeegen replaces the sign-in entry and takes a Brave key', () => {
    const ids = api.AI_SEARCH_PROVIDERS.map((m) => m.id)
    expect(ids[0]).toBe('oxeegen')
    expect(ids).not.toContain('genspark')
    expect(api.AI_SEARCH_PROVIDERS[0]?.keyPlaceholder).toMatch(/Brave/)
  })
})

describe('upgrading from OxeeOffice 0.9.431', () => {
  // the shape of a real 0.9.431 ai-settings.json (keys replaced)
  const legacy = {
    provider: 'genspark',
    providers: {
      genspark: { apiKey: 'oxee-key', model: 'Oxee-max', baseUrl: US },
    },
    media: {
      imageProvider: 'openai',
      analysisProvider: 'oxeegen',
      videoAnalysisProvider: 'oxeegen',
      providers: {
        oxeegen: { apiKey: 'oxee-key', imageModel: '', analysisModel: 'Oxee-flash' },
        openai: { apiKey: 'sk-openai', imageModel: 'gpt-image-2', analysisModel: 'gpt-5.6-luna' },
      },
    },
    search: {
      provider: 'oxeegen',
      providers: { oxeegen: { apiKey: 'brave-key' }, serper: { apiKey: '' }, tavily: { apiKey: '' } },
    },
  }

  it('keeps the chat key, endpoint and model under Oxeegen', () => {
    // biome-ignore lint: test fixture mirrors an untyped settings file
    const s = api.resolveAiSettings(legacy as never, api.defaultAiSettings())
    expect(s.provider).toBe('oxeegen')
    expect(s.providers.oxeegen).toEqual({ apiKey: 'oxee-key', model: 'Oxee-max', baseUrl: US })
    expect(api.activeProvider(s)).toBe('oxeegen')
    expect(api.getProviderAdapter(api.activeProvider(s)).resolveEndpoint(s.providers.oxeegen)).toMatchObject({
      protocol: 'openai-compatible',
      baseUrl: US,
    })
  })

  it('keeps media choices and keys, and fills the blank Oxeegen endpoint', () => {
    const s = api.resolveAiSettings(legacy as never, api.defaultAiSettings())
    expect(s.media?.imageProvider).toBe('openai')
    expect(s.media?.analysisProvider).toBe('oxeegen')
    expect(s.media?.providers.oxeegen).toEqual({
      apiKey: 'oxee-key',
      imageModel: '',
      analysisModel: 'Oxee-flash',
      baseUrl: US,
    })
    expect(s.media?.providers.openai?.apiKey).toBe('sk-openai')
    expect(api.activeMediaProvider(s, 'analysis')).toBe('oxeegen')
    expect(api.activeMediaProvider(s, 'video')).toBe('oxeegen')
    expect(api.activeMediaProvider(s, 'image')).toBe('openai')
  })

  it('keeps the Brave key on the Oxeegen search entry', () => {
    const s = api.resolveAiSettings(legacy as never, api.defaultAiSettings())
    expect(s.search?.provider).toBe('oxeegen')
    expect(s.search?.providers.oxeegen).toEqual({ apiKey: 'brave-key' })
    expect(api.activeSearchProvider(s)).toBe('oxeegen')
  })

  it('moves Genspark sign-in selections to Oxeegen and OpenAI', () => {
    const s = api.resolveAiSettings(
      {
        provider: 'genspark',
        providers: {},
        media: { imageProvider: 'genspark', analysisProvider: 'genspark', videoAnalysisProvider: 'genspark' },
        search: { provider: 'genspark' },
      } as never,
      api.defaultAiSettings(),
    )
    expect(s.provider).toBe('oxeegen')
    expect(s.media?.imageProvider).toBe('openai')
    expect(s.media?.analysisProvider).toBe('oxeegen')
    expect(s.media?.videoAnalysisProvider).toBe('oxeegen')
    expect(s.search?.provider).toBe('oxeegen')
  })

  it('does not overwrite an Oxeegen key that is already set', () => {
    const s = api.resolveAiSettings(
      {
        provider: 'oxeegen',
        providers: {
          genspark: { apiKey: 'old', model: 'Oxee-pro', baseUrl: US },
          oxeegen: { apiKey: 'new', model: 'Oxee-flash', baseUrl: EU },
        },
      } as never,
      api.defaultAiSettings(),
    )
    expect(s.providers.oxeegen).toEqual({ apiKey: 'new', model: 'Oxee-flash', baseUrl: EU })
  })
})

describe('images on OpenAI gpt-image-2.5-flare', () => {
  const PNG_B64 =
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='

  it('offers Flare first, as the default, in place of gpt-image-2', () => {
    const openai = api.getMediaProviderMeta('openai')!
    expect(openai.defaultImageModel).toBe('gpt-image-2.5-flare')
    expect(openai.imageModels[0]).toBe('gpt-image-2.5-flare')
    expect(openai.imageModels).not.toContain('gpt-image-2')
  })

  it('reads a saved gpt-image-2 as Flare and keeps any other model', () => {
    const read = (imageModel: string) =>
      api.resolveAiSettings(
        {
          provider: 'oxeegen',
          providers: { oxeegen: { apiKey: 'k', model: 'Oxee-max', baseUrl: US } },
          media: { imageProvider: 'openai', providers: { openai: { apiKey: 'sk', imageModel, analysisModel: '' } } },
        } as never,
        api.defaultAiSettings(),
      ).media!.providers.openai!.imageModel
    expect(read('gpt-image-2')).toBe('gpt-image-2.5-flare')
    expect(read('gpt-image-1-mini')).toBe('gpt-image-1-mini')
  })

  it('asks OpenAI for medium quality on generations and edits, and only there', async () => {
    const calls: RequestInit[] = []
    vi.stubGlobal(
      'fetch',
      vi.fn(async (_url: string, init?: RequestInit) => {
        calls.push(init!)
        return new Response(JSON.stringify({ data: [{ b64_json: PNG_B64 }] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      }),
    )
    const png = { bytes: Uint8Array.from(atob(PNG_B64), (c) => c.charCodeAt(0)), mime: 'image/png' }
    try {
      const openai = { apiKey: 'sk', imageModel: 'gpt-image-2.5-flare', analysisModel: '' }
      await api.generateImageWithProvider('openai', openai, { prompt: 'lake', aspectRatio: '16:9' })
      await api.generateImageWithProvider('openai', openai, { prompt: 'edit', references: [png] })
      await api.generateImageWithProvider('custom', { apiKey: '', baseUrl: 'http://localhost:1/v1', imageModel: 'gpt-image-1', analysisModel: '' }, { prompt: 'x' })
    } finally {
      vi.unstubAllGlobals()
    }
    expect(JSON.parse(String(calls[0]!.body))).toEqual({
      model: 'gpt-image-2.5-flare',
      prompt: 'lake',
      n: 1,
      size: '1536x1024',
      quality: 'medium',
    })
    expect((calls[1]!.body as FormData).get('quality')).toBe('medium')
    expect(JSON.parse(String(calls[2]!.body))).not.toHaveProperty('quality')
  })
})
