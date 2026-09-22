/**
 * OxeeOffice: tear a tab out of the strip into its own window by dragging it
 * downwards, the gesture people try first. Upstream only offers the tab's
 * right-click menu ("Open in New Window").
 *
 * The drag itself is upstream's reorder drag: the pointer is captured by the
 * tab, so the moves keep arriving while the pointer is over the editor below.
 * Pulling far enough down switches the drag from "reorder" to "tear off", and
 * pulling back up switches it back, so a slip never detaches anything.
 */

/** How far below the pointer-down point the pointer must travel to tear off. */
export const TEAR_OFF_PX = 44

/** Tabs that can live in their own window: every editor, never Home. */
export function isTearOffTab(kind: string): boolean {
  return kind !== 'home'
}

/** Whether the drag currently reads as a tear-off rather than a reorder. */
export function isTearOff(dy: number, kind: string): boolean {
  return isTearOffTab(kind) && dy >= TEAR_OFF_PX
}
