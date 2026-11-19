/**
 * OxeeOffice: reasoning effort for Oxee models, picked next to the model in
 * every AI panel's composer and in Settings › AI Model. Upstream's per-model
 * thinking picker (thinking-effort.ts) reaches this file through two hooks:
 * the family table (thinkingShapeFor) and the request body
 * (toggleThinkingBodyFor). The pick is stored like any other family's, in the
 * provider config's per-model `thinking` map.
 *
 * Measured on the Oxeegen endpoint (2026-11-19):
 * - reasoning off is the vLLM chat-template switch
 *   (`chat_template_kwargs.enable_thinking: false`), as for the execution steps;
 * - the levels ride the top-level `reasoning_effort` field (the same field
 *   inside `chat_template_kwargs` is ignored);
 * - Oxee-instant does not reason and turns slow and verbose when it is sent
 *   either field, so it has no effort control and never gets one (compaction
 *   runs on it);
 * - Oxee-ultra ignores the off switch, so it is not offered here.
 *
 * Steps that carry out a plan (slide pages, layout checks, writers) keep
 * their reasoning-off switch whatever the pick (oxeegenRoleSettings).
 */
import { oxeegenLayerEnabled } from './oxeegen'
import type { ThinkingEffort, ThinkingShape } from './thinking-effort'

/** The levels offered, lowest first: No reasoning, Low, Extra High, Max. */
export const OXEEGEN_EFFORT_LEVELS: readonly ThinkingEffort[] = ['none', 'low', 'xhigh', 'max']

/** Used until the person picks a level for the model. */
export const OXEEGEN_DEFAULT_EFFORT: ThinkingEffort = 'max'

/** What the composer chip and Settings show for each level. */
export const OXEEGEN_EFFORT_LABELS: Readonly<Record<string, string>> = {
  none: 'No reasoning',
  low: 'Low',
  xhigh: 'Extra High',
  max: 'Max',
}

/** The Oxee chat models that reason and honour the effort fields. */
const OXEE_EFFORT_MODEL = /^oxee-(max|pro|flash)$/i

/** The Oxee family's effort surface, or null for any other model. */
export function oxeegenThinkingShape(model: string): ThinkingShape | null {
  if (!oxeegenLayerEnabled() || !OXEE_EFFORT_MODEL.test(model.trim())) return null
  return { kind: 'oxeegen', levels: OXEEGEN_EFFORT_LEVELS }
}

/** The level in force for this model (the pick, else Max), or null when it has no effort control. */
export function oxeegenEffortLevel(config: {
  model: string
  thinking?: Record<string, string> | undefined
}): ThinkingEffort | null {
  if (!oxeegenThinkingShape(config.model)) return null
  const pick = config.thinking?.[config.model]
  return OXEEGEN_EFFORT_LEVELS.find((level) => level === pick) ?? OXEEGEN_DEFAULT_EFFORT
}

/**
 * The request fields for the level in force. null = not an Oxee effort model
 * (upstream's families decide); undefined = send nothing from here, because a
 * step that carries out a plan already sends the reasoning-off switch through
 * its endpoint.
 */
export function oxeegenThinkingBody(config: {
  model: string
  thinking?: Record<string, string> | undefined
}): Record<string, unknown> | undefined | null {
  const level = oxeegenEffortLevel(config)
  if (level === null) return null
  if ((config as { oxeegenNoThinking?: boolean }).oxeegenNoThinking === true) return undefined
  if (level === 'none') return { chat_template_kwargs: { enable_thinking: false } }
  return { reasoning_effort: level }
}

/** A copy of the settings with `level` picked for the active Oxee model. */
export function withOxeegenEffort<
  S extends { provider: string; providers: Record<string, unknown> },
>(settings: S, level: ThinkingEffort): S {
  const config = settings.providers[settings.provider] as
    | { model?: string; thinking?: Record<string, string> }
    | undefined
  if (!config?.model) return settings
  return {
    ...settings,
    providers: {
      ...settings.providers,
      [settings.provider]: { ...config, thinking: { ...(config.thinking ?? {}), [config.model]: level } },
    },
  }
}
