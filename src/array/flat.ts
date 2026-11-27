/**
 * Given an array of arrays, returns a single dimensional array with
 * all items in it.
 *
 * @see https://radashi.js.org/reference/array/flat
 * @example
 * ```ts
 * flat([[1, 2], [[3], 4], [5]])
 * // [1, 2, [3], 4, 5]
 * ```
 * @version 12.1.0
 */
export function flat<T>(lists: readonly T[][]): T[] {
  // Skip holes in `lists`, like `reduce` does.
  const out: T[] = new Array(
    lists.reduce((total, list) => total + list.length, 0),
  )
  let offset = 0
  for (let i = 0; i < lists.length; i++) {
    if (i in lists) {
      const list = lists[i]
      for (let j = 0; j < list.length; j++) {
        out[offset++] = list[j]
      }
    }
  }
  return out
}
