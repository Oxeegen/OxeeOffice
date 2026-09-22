// OxeeOffice: dragging a tab below the strip tears it out into its own window.
import { describe, expect, it } from 'vitest'
import { TEAR_OFF_PX, isTearOff, isTearOffTab } from '../src/renderer/src/oxee-tab-tearoff'

describe('tab tear-off', () => {
  it('needs a deliberate downward pull, and lets the user pull back up', () => {
    expect(isTearOff(0, 'docs')).toBe(false)
    expect(isTearOff(TEAR_OFF_PX - 1, 'docs')).toBe(false)
    expect(isTearOff(TEAR_OFF_PX, 'docs')).toBe(true)
    expect(isTearOff(200, 'docs')).toBe(true)
    // dragging upwards or sideways stays a reorder
    expect(isTearOff(-200, 'docs')).toBe(false)
  })

  it('applies to every editor, never to Home', () => {
    for (const kind of ['docs', 'sheets', 'slides', 'pdf', 'markdown', 'html']) {
      expect(isTearOffTab(kind)).toBe(true)
      expect(isTearOff(TEAR_OFF_PX, kind)).toBe(true)
    }
    expect(isTearOffTab('home')).toBe(false)
    expect(isTearOff(500, 'home')).toBe(false)
  })
})
