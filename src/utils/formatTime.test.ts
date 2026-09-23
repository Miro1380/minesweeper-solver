import { describe, expect, it } from 'vitest'
import { formatTime } from './formatTime'

describe('formatTime', () => {
  it.each([
    [0, '00:00'],
    [999, '00:00'],
    [1000, '00:01'],
    [61_000, '01:01'],
    [3_661_000, '61:01'],
  ])('formats %dms as %s', (ms, expected) => {
    expect(formatTime(ms)).toBe(expected)
  })
})
