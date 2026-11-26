/**
 * Creates an array of ungrouped elements, where each resulting array
 * contains all elements at a specific index from the input arrays.
 * The first array contains all first elements, the second array
 * contains all second elements, and so on.
 *
 * @see https://radashi.js.org/reference/array/unzip
 * @example
 * ```ts
 * unzip([['a', 1, true], ['b', 2, false]])
 * // [['a', 'b'], [1, 2], [true, false]]
 * ```
 * @version 12.2.0
 */
export function unzip<T>(arrays: readonly (readonly T[])[]): T[][] {
  const numArrays = arrays.length
  let maxLen = 0
  for (let i = 0; i < numArrays; i++) {
    const len = arrays[i].length
    if (len > maxLen) {
      maxLen = len
    }
  }
  const out: T[][] = new Array(maxLen)
  for (let i = 0; i < maxLen; i++) {
    const group = new Array<T>(numArrays)
    for (let j = 0; j < numArrays; j++) {
      group[j] = arrays[j][i]
    }
    out[i] = group
  }
  return out
}
