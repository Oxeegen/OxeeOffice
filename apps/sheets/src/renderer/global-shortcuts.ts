export const MODAL_MASK_SELECTOR = '.dialog-backdrop'

export function isModalOpen(root: Pick<Document, 'querySelector'> | null = document): boolean {
  if (!root) return false
  return root.querySelector(MODAL_MASK_SELECTOR) !== null
}

export type GlobalShortcutAction =
  | { readonly kind: 'dialog'; readonly dialog: 'formatCells' | 'goTo' }
  | { readonly kind: 'command'; readonly command: string }

export interface GlobalShortcutKeyEvent {
  readonly key: string
  readonly code: string
  readonly metaKey: boolean
  readonly ctrlKey: boolean
  readonly altKey: boolean
  readonly shiftKey: boolean
  readonly defaultPrevented: boolean
}

export interface GlobalShortcutGuards {
  readonly modalOpen: boolean
  readonly cellEditing: boolean
  readonly gridTarget: boolean
}

export function resolveGlobalShortcut(
  event: GlobalShortcutKeyEvent,
  guards: GlobalShortcutGuards,
): GlobalShortcutAction | null {
  if (guards.modalOpen) return null
  const accel = event.metaKey || event.ctrlKey
  const canEdit = !guards.cellEditing && guards.gridTarget

  if (accel && event.key === '1') return { kind: 'dialog', dialog: 'formatCells' }
  if (accel && event.key === 'g') return { kind: 'dialog', dialog: 'goTo' }
  if (accel && event.key === '`') return { kind: 'command', command: 'toggle-show-formulas' }

  if (accel && !event.shiftKey && event.key === '5' && canEdit) {
    return { kind: 'command', command: 'strike' }
  }
  if (event.altKey && !event.metaKey && !event.ctrlKey && event.key === '=' && canEdit) {
    return { kind: 'command', command: 'autofn:SUM' }
  }
  if (accel && event.code === 'Semicolon' && canEdit) {
    return { kind: 'command', command: event.shiftKey ? 'insert-now:time' : 'insert-now:date' }
  }
  if (
    event.key === 'F9' &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.altKey &&
    !guards.cellEditing
  ) {
    return { kind: 'command', command: event.shiftKey ? 'calculate-sheet' : 'calculate-now' }
  }
  if (
    (event.key === 'PageDown' || event.key === 'PageUp') &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.defaultPrevented &&
    guards.gridTarget
  ) {
    const axis = event.altKey ? 'page-col' : 'page-row'
    return { kind: 'command', command: `${axis}:${event.key === 'PageDown' ? 1 : -1}` }
  }
  return null
}
