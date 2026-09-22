import { describe, expect, it } from 'vitest'
import { computeSortedRowOrder } from '../src/domain/sort-range'

describe('computeSortedRowOrder non-finite keys', () => {
  it('sorts finite numbers deterministically around non-finite keys', () => {
    const rows = [[3], [NaN], [1], [Infinity], [2], [-Infinity]] as const
    const first = computeSortedRowOrder(
      rows.map((r) => [...r]),
      0,
      true,
    )
    // finite ascending first, then non-finite, blanks last per Excel order
    expect(first.slice(0, 3).map((i) => rows[i]![0])).toEqual([1, 2, 3])
    // repeated runs are identical (no NaN-comparator flakiness)
    for (let k = 0; k < 10; k++) {
      expect(
        computeSortedRowOrder(
          rows.map((r) => [...r]),
          0,
          true,
        ),
      ).toEqual(first)
    }
  })

  it('keeps normal numeric order unchanged', () => {
    const rows = [[3], [1], [2]] as const
    expect(
      computeSortedRowOrder(
        rows.map((r) => [...r]),
        0,
        true,
      ),
    ).toEqual([1, 2, 0])
    expect(
      computeSortedRowOrder(
        rows.map((r) => [...r]),
        0,
        false,
      ),
    ).toEqual([0, 2, 1])
  })
})
