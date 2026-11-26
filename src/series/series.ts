export interface Series<T> {
  min: (a: T, b: T) => T
  max: (a: T, b: T) => T
  first: () => T
  last: () => T
  next: (current: T, defaultValue?: T) => T
  previous: (current: T, defaultValue?: T) => T
  spin: (current: T, num: number) => T
}

const defaultToKey = (item: unknown): string => `${item}`

/**
 * Creates a series object around a list of values that should be
 * treated with order.
 *
 * @see https://radashi.js.org/reference/series/series
 * @example
 * ```ts
 * const numbers = series([1, 2, 3])
 *
 * numbers.first() // => 1
 * numbers.last() // => 3
 * numbers.next(2) // => 3
 * numbers.previous(2) // => 1
 * numbers.spin(2, 1) // => 3
 * numbers.spin(2, -1) // => 1
 * ```
 * @version 12.1.0
 */
export const series = <T>(
  items: readonly T[],
  toKey: (item: T) => string | symbol = defaultToKey,
): Series<T> => {
  const len = items.length
  const indexesByKey: Record<string | symbol, number> = {}
  const itemsByIndex = items.slice()

  for (let idx = 0; idx < len; idx++) {
    indexesByKey[toKey(itemsByIndex[idx])] = idx
  }

  return {
    /**
     * Given two values in the series, returns the value that occurs
     * earlier in the series.
     */
    min(a, b) {
      return indexesByKey[toKey(a)] < indexesByKey[toKey(b)] ? a : b
    },
    /**
     * Given two values in the series, returns the value that occurs
     * later in the series.
     */
    max(a, b) {
      return indexesByKey[toKey(a)] > indexesByKey[toKey(b)] ? a : b
    },
    /**
     * Returns the first item from the series.
     */
    first() {
      return itemsByIndex[0]
    },
    /**
     * Returns the last item in the series.
     */
    last() {
      return itemsByIndex[len - 1]
    },
    /**
     * Given an item in the series, returns the next item in the series
     * or `defaultValue` if the given value is the last item in the series.
     */
    next(current, defaultValue) {
      return (
        itemsByIndex[indexesByKey[toKey(current)] + 1] ??
        defaultValue ??
        itemsByIndex[0]
      )
    },
    /**
     * Given an item in the series, returns the previous item in the
     * series or `defaultValue` if the given value is the first item in
     * the series.
     */
    previous(current, defaultValue) {
      return (
        itemsByIndex[indexesByKey[toKey(current)] - 1] ??
        defaultValue ??
        itemsByIndex[len - 1]
      )
    },
    /**
     * A more dynamic method than `next` and `previous` that lets you move
     * many times in either direction.
     *
     * ```ts
     * series(weekdays).spin('wednesday', 3) // => 'monday'
     * series(weekdays).spin('wednesday', -3) // => 'friday'
     * ```
     */
    spin(current, num) {
      if (!Number.isFinite(num)) {
        return current
      }
      const steps = Math.trunc(num)
      if (steps === 0 || len === 0) {
        return current
      }
      const idx = indexesByKey[toKey(current)]
      if (typeof idx !== 'number') {
        const abs = Math.abs(steps)
        const rel = abs > len ? abs % len : abs
        if (rel === 0) {
          return current
        }
        return itemsByIndex[steps > 0 ? rel - 1 : len - rel]
      }
      const nextIdx = (idx + steps) % len
      return itemsByIndex[nextIdx < 0 ? nextIdx + len : nextIdx]
    },
  }
}
