import React, { useCallback, useRef, useState } from 'react'
import {
  OXEEGEN_EFFORT_LABELS,
  OXEEGEN_EFFORT_LEVELS,
  oxeegenEffortLevel,
  withOxeegenEffort,
  type AiSettings,
  type ThinkingEffort,
} from '@genoffice/ai-provider/browser'
import { useDismissablePopover } from './popover-dismiss'

/** The chip's short form; the menu and the tooltip carry the full names. */
const CHIP_LABELS: Readonly<Record<string, string>> = { none: 'Off', low: 'Low', xhigh: 'X-High', max: 'Max' }

/** Keeps the model name readable beside the chip in a narrow composer footer. */
const FOOTER_CSS =
  '.ai-model-picker:has(.oxee-effort-chip){min-width:150px;flex-shrink:0}' +
  '.ai-model-picker:has(.oxee-effort-chip)>.ai-model-chip:not(.oxee-effort-chip){min-width:72px}' +
  '.oxee-effort-chip{flex:0 0 auto;padding:0 6px 0 5px}'

/**
 * OxeeOffice: the reasoning level of the active Oxee model, as a second chip
 * next to the model chip in every composer (AiModelPicker hook). The pick is
 * saved per model in ai-settings.json, the same place Settings › AI Model
 * edits it; models without an effort control (Oxee-instant, other vendors)
 * show nothing. See packages/ai-provider/src/oxee-effort.ts.
 */
export function OxeeEffortChip({
  settings,
  onChange,
}: {
  readonly settings: AiSettings
  readonly onChange: (next: AiSettings) => void
}): React.JSX.Element | null {
  const [open, setOpen] = useState(false)
  const [popStyle, setPopStyle] = useState<React.CSSProperties>({})
  const chipRef = useRef<HTMLButtonElement | null>(null)
  const popRef = useRef<HTMLDivElement | null>(null)
  const close = useCallback(() => setOpen(false), [])
  useDismissablePopover(open, close, {
    inside: () => [chipRef.current, popRef.current],
  })

  // settings can arrive partial (tests, an older file): no providers map means no chip
  const providers = settings?.providers as
    | Record<string, { model?: string; thinking?: Record<string, string> } | undefined>
    | undefined
  const config = settings?.provider ? providers?.[settings.provider] : undefined
  const level =
    settings?.provider === 'oxeegen' && config?.model
      ? oxeegenEffortLevel({ model: config.model, thinking: config.thinking })
      : null
  if (!level) return null
  const label = OXEEGEN_EFFORT_LABELS[level] ?? level
  const short = CHIP_LABELS[level] ?? label

  const toggle = () => {
    if (!open) {
      const rect = chipRef.current?.getBoundingClientRect()
      // the composer sits at the panel bottom: open upwards, pinned to the chip
      if (rect) setPopStyle({ left: rect.left, bottom: window.innerHeight - rect.top + 6 })
    }
    setOpen((v) => !v)
  }

  const pick = (next: ThinkingEffort) => {
    setOpen(false)
    if (next !== level) onChange(withOxeegenEffort(settings, next))
  }

  return (
    <>
      <style>{FOOTER_CSS}</style>
      <button
        ref={chipRef}
        type="button"
        className={`ai-model-chip oxee-effort-chip${open ? ' open' : ''}`}
        style={{ marginLeft: 3 }}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && open) {
            e.stopPropagation()
            setOpen(false)
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        data-tip={`Reasoning: ${label}`}
        aria-label={`Reasoning: ${label}`}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M12 3a6 6 0 0 0-3.5 10.9V17h7v-3.1A6 6 0 0 0 12 3z" />
          <path d="M9.5 21h5" />
        </svg>
        <span className="ai-model-chip-text">{short}</span>
        <svg className="ai-model-chip-caret" width="10" height="10" viewBox="0 0 10 10" aria-hidden>
          <path d="M2 6.5 5 3.5l3 3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div ref={popRef} className="ai-model-pop" role="listbox" aria-label="Reasoning" style={popStyle}>
          <div className="ai-model-pop-list">
            <div className="ai-model-group">
              <div className="ai-model-group-head">
                <span>Reasoning</span>
              </div>
              {OXEEGEN_EFFORT_LEVELS.map((l) => {
                const selected = l === level
                return (
                  <button
                    key={l}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    className={`ai-model-item${selected ? ' selected' : ''}`}
                    onClick={() => pick(l)}
                  >
                    <span className="ai-model-item-text">{OXEEGEN_EFFORT_LABELS[l] ?? l}</span>
                    {selected && (
                      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
                        <path d="M2.5 6.5 5 9l4.5-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
