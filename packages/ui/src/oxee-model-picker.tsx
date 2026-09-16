/**
 * OxeeOffice — model picker for the editors' AI panels (fork-owned file).
 *
 * Replaces the panel title with a dropdown of the active provider's models,
 * sitting next to the mark on the left of the header. Upstream has no picker:
 * the model is only chosen in Settings.
 *
 * Settings are one shared file (ai-settings.json) and every editor tab is its
 * own renderer, so a change must reach the others. Picking a model saves it,
 * then fires OXEE_AI_SETTINGS_CHANGED; pickers and apps also re-read settings
 * whenever their window regains focus or becomes visible. Docs, Sheets and
 * Slides hold settings in React state loaded once at mount — upstream's reason
 * a model changed elsewhere was ignored until reload — so they subscribe with
 * useAiSettingsRefresh.
 */

import React, { useCallback, useEffect, useState } from 'react'
import { Dropdown } from './dropdown'
import { OXEE_MARK_DATA_URI } from './oxee-mark'

export const OXEE_AI_SETTINGS_CHANGED = 'oxee:ai-settings-changed'

/** Only `model` is read; the other fields (key, base URL) survive via spread. */
interface PickerProviderConfig {
  model: string
}

export interface PickerSettings {
  provider: string
  providers: Record<string, PickerProviderConfig | undefined>
}

export interface PickerCatalogEntry {
  readonly id: string
  readonly models: readonly string[]
  readonly defaultModel: string
}

/** "Oxee-max" → "Oxee Max"; other vendors' ids are shown as they are. */
export function modelDisplayName(id: string): string {
  const m = /^oxee-(.+)$/i.exec(id)
  if (!m) return id
  return 'Oxee ' + m[1]!.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

/** Calls `reload` on window focus, on becoming visible, and when any picker saves. */
export function useAiSettingsRefresh(reload: () => void, enabled = true): void {
  useEffect(() => {
    if (!enabled) return
    // a renderer without its preload bridge (tests) must not throw from a listener
    const run = () => {
      try {
        reload()
      } catch {
        /* no bridge */
      }
    }
    const onVisible = () => {
      if (document.visibilityState === 'visible') run()
    }
    window.addEventListener('focus', run)
    window.addEventListener(OXEE_AI_SETTINGS_CHANGED, run)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.removeEventListener('focus', run)
      window.removeEventListener(OXEE_AI_SETTINGS_CHANGED, run)
      document.removeEventListener('visibilitychange', onVisible)
    }
    // reload is expected to be stable enough; re-subscribing on identity change is harmless
  }, [reload, enabled])
}

export function OxeeMark({ size = 18 }: { size?: number }): React.JSX.Element {
  return (
    <img
      src={OXEE_MARK_DATA_URI}
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
      style={{ display: 'block', flex: 'none', objectFit: 'contain' }}
    />
  )
}

export function OxeeModelPicker({
  enabled,
  catalog,
  load,
  save,
  fallback,
}: {
  /** false renders `fallback` (upstream's title) — the Oxeegen layer is off */
  readonly enabled: boolean
  readonly catalog: readonly PickerCatalogEntry[]
  readonly load: () => Promise<PickerSettings | null | undefined>
  readonly save: (settings: PickerSettings) => Promise<unknown>
  readonly fallback: React.ReactNode
}): React.JSX.Element {
  const [settings, setSettings] = useState<PickerSettings | null>(null)
  const reload = useCallback(() => {
    try {
      void load()
        .then((s) => setSettings(s ?? null))
        .catch(() => {})
    } catch {
      /* no bridge */
    }
  }, [load])

  useEffect(() => {
    if (enabled) reload()
  }, [enabled, reload])
  useAiSettingsRefresh(reload, enabled)

  if (!enabled || !settings) return <>{fallback}</>
  const entry = catalog.find((c) => c.id === settings.provider)
  // providers without a fixed list (custom endpoints, Codex) keep the title
  if (!entry || entry.models.length === 0) return <>{fallback}</>
  const current = settings.providers[settings.provider]?.model || entry.defaultModel
  const models = entry.models.includes(current) ? entry.models : [current, ...entry.models]

  const pick = (model: string) => {
    if (model === current) return
    void load()
      .then(async (fresh) => {
        const base = fresh ?? settings
        const config = base.providers[base.provider] ?? { model: '' }
        const next: PickerSettings = {
          ...base,
          providers: { ...base.providers, [base.provider]: { ...config, model } },
        }
        await save(next)
        setSettings(next)
        window.dispatchEvent(new Event(OXEE_AI_SETTINGS_CHANGED))
      })
      .catch(() => {})
  }

  return (
    <Dropdown
      className="oxee-model-picker"
      value={current}
      ariaLabel="AI model"
      tip="AI model"
      options={models.map((m) => ({ value: m, label: modelDisplayName(m) }))}
      onPick={pick}
    />
  )
}
