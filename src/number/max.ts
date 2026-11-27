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
    if (!found || !(bestVal > val)) {
      found = true
      best = item
      bestVal = val
    }
  }
  return best
}
