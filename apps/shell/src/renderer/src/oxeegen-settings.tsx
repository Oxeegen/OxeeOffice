/**
 * OxeeOffice — Oxeegen-specific pieces of Settings (fork-owned file).
 * SettingsModal.tsx reaches them through hooks marked "OxeeOffice brand hook".
 */

import { OXEEGEN_REGIONS, oxeegenLayerEnabled } from '@genoffice/ai-provider/browser'

const sameUrl = (a: string, b: string) =>
  a.trim().replace(/\/+$/, '').toLowerCase() === b.trim().replace(/\/+$/, '').toLowerCase()

/**
 * One-click region endpoints under the Base URL field. Oxeegen keys are
 * issued per region, so switching region also means pasting that region's key.
 */
export function OxeegenRegionRow({
  id,
  value,
  onPick,
}: {
  id: string
  value: string
  onPick: (baseUrl: string) => void
}) {
  return (
    <div className="set-field">
      <div className="set-field-text">
        <div className="set-field-stack">
          <label className="set-field-label" htmlFor={id}>
            Region
          </label>
          <div className="set-field-desc">Sets the endpoint. Each region uses its own API key.</div>
        </div>
      </div>
      <div id={id} role="group" aria-label="Oxeegen region" style={{ display: 'flex', gap: 8 }}>
        {OXEEGEN_REGIONS.map((region) => {
          const active = sameUrl(value, region.baseUrl)
          return (
            <button
              key={region.id}
              type="button"
              className={`set-btn${active ? ' primary' : ''}`}
              aria-pressed={active}
              data-tip={region.baseUrl}
              onClick={() => onPick(region.baseUrl)}
            >
              {region.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/** Shown under the search provider when Oxeegen (backed by Brave) is selected. */
export const OXEEGEN_SEARCH_HINT = 'Brave Search serves both web and image search with your key.'

/** OxeeOffice has no account: the Genspark sign-in and credits page is not shown. */
export function visibleSettingsSections<T extends { id: string }>(sections: readonly T[]): readonly T[] {
  return oxeegenLayerEnabled() ? sections.filter((s) => s.id !== 'account') : sections
}

export function initialSettingsSection<T extends string>(upstreamDefault: T): T {
  return (oxeegenLayerEnabled() && upstreamDefault === 'account' ? 'aiModel' : upstreamDefault) as T
}

export { oxeegenLayerEnabled }
