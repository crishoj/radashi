/**
 * Max gets the greatest value from a list.
 *
 * @see https://radashi.js.org/reference/array/max
 * @example
 * ```ts
 * max([2, 3, 5]) // => 5
 * max([{ num: 1 }, { num: 2 }], x => x.num) // => { num: 2 }
 * ```
 * @version 12.1.0
 */
export function max(array: readonly [number, ...number[]]): number
export function max(array: readonly number[]): number | null
export function max<T>(
  array: readonly [T, ...T[]],
  getter: (item: T) => number,
): T
export function max<T>(
  array: readonly T[],
  getter: (item: T) => number,
): T | null
export function max<T>(
  array: readonly T[],
  getter?: (item: T) => number,
): T | null {
  const length = array.length
  if (!length) {
    return null
  }
  let best = array[0]
  if (length === 1) {
    return best
  }
  if (getter) {
    let bestVal = getter(best)
    for (let i = 1; i < length; i++) {
      const item = array[i]
      const val = getter(item)
      if (!(bestVal > val)) {
        best = item
        bestVal = val
      }
    }
    return best
  }
  for (let i = 1; i < length; i++) {
    const item = array[i]
    if (!(best > item)) {
      best = item
    }
  }
  return best
}
