/**
 * Min gets the smallest value from a list.
 *
 * @see https://radashi.js.org/reference/array/min
 * @example
 * ```ts
 * min([1, 2, 3, 4]) // => 1
 * min([{ num: 1 }, { num: 2 }], x => x.num) // => { num: 1 }
 * ```
 * @version 12.1.0
 */
export function min(array: readonly [number, ...number[]]): number
export function min(array: readonly number[]): number | null
export function min<T>(
  array: readonly [T, ...T[]],
  getter: (item: T) => number,
): T
export function min<T>(
  array: readonly T[],
  getter: (item: T) => number,
): T | null
export function min<T>(
  array: readonly T[],
  getter?: (item: T) => number,
): T | null {
  let best: T | null = null
  let bestVal: any
  let found = false
  for (let i = 0; i < array.length; i++) {
    const item = array[i]
    // Skip holes in sparse arrays, like `reduce` does.
    if (item === undefined && !(i in array)) {
      continue
    }
    const val = getter ? getter(item) : item
    if (!found || !(bestVal < val)) {
      found = true
      best = item
      bestVal = val
    }
  }
  return best
}
