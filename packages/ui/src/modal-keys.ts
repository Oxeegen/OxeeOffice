/**
 * Shared modal keyboard behavior for the renderer dialogs: Esc closes (stopped
 * so it never reaches global listeners), Tab cycles inside the modal, and the
 * first form control gets focus on mount unless something inside is already
 * focused. Spread the returned ref/onKeyDown onto the modal backdrop element.
 */
import { useEffect, useRef } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'

const FOCUSABLE = 'button, input, textarea, select, [tabindex]:not([tabindex="-1"])'

export function useModalKeys(onClose: () => void, options?: { restoreFocus?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const restoreFocus = options?.restoreFocus ?? false

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const previous =
      restoreFocus && document.activeElement instanceof HTMLElement ? document.activeElement : null
    if (!el.contains(document.activeElement)) {
      const first = el.querySelector<HTMLElement>('input, textarea, select, button')
      ;(first ?? el).focus()
    }
    return () => {
      if (previous && previous.isConnected) previous.focus()
    }
  }, [restoreFocus])

  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      onClose()
      return
    }
    if (e.key === 'Tab') trapTab(ref.current, e)
  }

  return { ref, onKeyDown }
}

/** Cycle Tab/Shift+Tab inside a container (pure DOM helper, exported for tests). */
export function trapTab(
  container: HTMLElement | null,
  e: { key: string; shiftKey: boolean; preventDefault: () => void },
): void {
  if (!container || e.key !== 'Tab') return
  const items = [...container.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
    (el) => !el.hasAttribute('disabled') && el.tabIndex >= 0,
  )
  if (items.length === 0) {
    e.preventDefault()
    return
  }
  const first = items[0]!
  const last = items[items.length - 1]!
  const active = document.activeElement as HTMLElement | null
  if (e.shiftKey && (active === first || !container.contains(active))) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && active === last) {
    e.preventDefault()
    first.focus()
  }
}
