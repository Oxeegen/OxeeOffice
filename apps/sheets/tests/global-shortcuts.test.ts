/**
 * Window-level document shortcuts must not reach the sheet while a modal is
 * open: the grid keeps focus behind the overlay, so the grid-target guard
 * cannot see the dialog. Routing is asserted per command, plus the dialog-open
 * gate that covers every branch (including the ones that used to bypass it).
 */
import { describe, expect, it } from 'vitest'
import {
  isModalOpen,
  resolveGlobalShortcut,
  type GlobalShortcutGuards,
  type GlobalShortcutKeyEvent,
} from '../src/renderer/global-shortcuts'

const GRID: GlobalShortcutGuards = { modalOpen: false, cellEditing: false, gridTarget: true }

function keyEvent(
  key: string,
  modifiers: Partial<Omit<GlobalShortcutKeyEvent, 'key' | 'code'>> = {},
  code = '',
): GlobalShortcutKeyEvent {
  return {
    key,
    code,
    metaKey: false,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    defaultPrevented: false,
    ...modifiers,
  }
}

const ctrl = { ctrlKey: true }
const meta = { metaKey: true }
const alt = { altKey: true }
const shift = { shiftKey: true }

describe('isModalOpen', () => {
  const stub = (hit: unknown) => ({ querySelector: () => hit }) as unknown as Document

  it('is true while a dialog backdrop is mounted', () => {
    expect(isModalOpen(stub({ className: 'dialog-backdrop' }))).toBe(true)
  })

  it('is false with no dialog and false for a null root', () => {
    expect(isModalOpen(stub(null))).toBe(false)
    expect(isModalOpen(null)).toBe(false)
  })
})

describe('global shortcuts are ignored while a modal is open', () => {
  const behindModal: GlobalShortcutGuards = { ...GRID, modalOpen: true }
  const combos: Array<[string, GlobalShortcutKeyEvent]> = [
    ['Ctrl+1 (Format Cells)', keyEvent('1', ctrl)],
    ['Ctrl+G (Go To)', keyEvent('g', ctrl)],
    ['Ctrl+` (Show Formulas)', keyEvent('`', ctrl)],
    ['F9 (recalculate)', keyEvent('F9')],
    ['Shift+F9 (calculate sheet)', keyEvent('F9', shift)],
    ['Ctrl+5 (strikethrough)', keyEvent('5', ctrl)],
    ['Alt+= (AutoSum)', keyEvent('=', alt)],
    ['Ctrl+; (insert date)', keyEvent(';', ctrl, 'Semicolon')],
    ['PageDown', keyEvent('PageDown')],
  ]

  for (const [name, event] of combos) {
    it(`ignores ${name}`, () => {
      expect(resolveGlobalShortcut(event, behindModal)).toBeNull()
    })
  }

  it('cannot stack a second modal with Ctrl+1 or Ctrl+G', () => {
    expect(resolveGlobalShortcut(keyEvent('1', ctrl), behindModal)).not.toEqual({
      kind: 'dialog',
      dialog: 'formatCells',
    })
    expect(resolveGlobalShortcut(keyEvent('g', ctrl), behindModal)).not.toEqual({
      kind: 'dialog',
      dialog: 'goTo',
    })
  })
})

describe('global shortcuts still route with no modal open', () => {
  it('opens the Format Cells dialog on Ctrl+1', () => {
    expect(resolveGlobalShortcut(keyEvent('1', ctrl), GRID)).toEqual({
      kind: 'dialog',
      dialog: 'formatCells',
    })
    expect(resolveGlobalShortcut(keyEvent('1', meta), GRID)).toEqual({
      kind: 'dialog',
      dialog: 'formatCells',
    })
  })

  it('opens Go To on Ctrl+G', () => {
    expect(resolveGlobalShortcut(keyEvent('g', ctrl), GRID)).toEqual({
      kind: 'dialog',
      dialog: 'goTo',
    })
  })

  it('toggles Show Formulas on Ctrl+`', () => {
    expect(resolveGlobalShortcut(keyEvent('`', ctrl), GRID)).toEqual({
      kind: 'command',
      command: 'toggle-show-formulas',
    })
  })

  it('recalculates on F9 and Shift+F9', () => {
    expect(resolveGlobalShortcut(keyEvent('F9'), GRID)).toEqual({
      kind: 'command',
      command: 'calculate-now',
    })
    expect(resolveGlobalShortcut(keyEvent('F9', shift), GRID)).toEqual({
      kind: 'command',
      command: 'calculate-sheet',
    })
  })

  it('keeps the grid-only guards on the sheet-writing commands', () => {
    expect(resolveGlobalShortcut(keyEvent('5', ctrl), GRID)).toEqual({
      kind: 'command',
      command: 'strike',
    })
    expect(resolveGlobalShortcut(keyEvent('=', alt), GRID)).toEqual({
      kind: 'command',
      command: 'autofn:SUM',
    })
    expect(resolveGlobalShortcut(keyEvent(';', ctrl, 'Semicolon'), GRID)).toEqual({
      kind: 'command',
      command: 'insert-now:date',
    })
    expect(
      resolveGlobalShortcut(keyEvent(';', { ...ctrl, shiftKey: true }, 'Semicolon'), GRID),
    ).toEqual({ kind: 'command', command: 'insert-now:time' })
  })

  it('pages the sheet with PageDown/PageUp and Alt for columns', () => {
    expect(resolveGlobalShortcut(keyEvent('PageDown'), GRID)).toEqual({
      kind: 'command',
      command: 'page-row:1',
    })
    expect(resolveGlobalShortcut(keyEvent('PageUp'), GRID)).toEqual({
      kind: 'command',
      command: 'page-row:-1',
    })
    expect(resolveGlobalShortcut(keyEvent('PageDown', alt), GRID)).toEqual({
      kind: 'command',
      command: 'page-col:1',
    })
  })
})

describe('non-grid targets and cell editing keep their existing guards', () => {
  const textField: GlobalShortcutGuards = {
    modalOpen: false,
    cellEditing: false,
    gridTarget: false,
  }
  const editing: GlobalShortcutGuards = { modalOpen: false, cellEditing: true, gridTarget: true }

  it('drops the grid-only commands from a text field', () => {
    expect(resolveGlobalShortcut(keyEvent('5', ctrl), textField)).toBeNull()
    expect(resolveGlobalShortcut(keyEvent('=', alt), textField)).toBeNull()
    expect(resolveGlobalShortcut(keyEvent(';', ctrl, 'Semicolon'), textField)).toBeNull()
    expect(resolveGlobalShortcut(keyEvent('PageDown'), textField)).toBeNull()
  })

  it('drops them while a cell is being edited, including F9', () => {
    expect(resolveGlobalShortcut(keyEvent('5', ctrl), editing)).toBeNull()
    expect(resolveGlobalShortcut(keyEvent('F9'), editing)).toBeNull()
  })

  it('ignores paging once something already handled the key', () => {
    expect(resolveGlobalShortcut(keyEvent('PageDown', { defaultPrevented: true }), GRID)).toBeNull()
  })

  it('leaves unrelated keys to the rest of the app', () => {
    expect(resolveGlobalShortcut(keyEvent('a'), GRID)).toBeNull()
    expect(resolveGlobalShortcut(keyEvent('F5'), GRID)).toBeNull()
    expect(resolveGlobalShortcut(keyEvent('g'), GRID)).toBeNull()
    expect(resolveGlobalShortcut(keyEvent('Enter'), GRID)).toBeNull()
  })
})
