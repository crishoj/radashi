type ReadonlyArray2D<T> = readonly (readonly T[])[]

/**
 * Create an [n-ary Cartesian product](https://en.wikipedia.org/wiki/Cartesian_product#n-ary_Cartesian_product)
 * from the given arrays.
 *
 * @see https://radashi.js.org/reference/array/cartesianProduct
 * @example
 * ```ts
 * cartesianProduct([
 *   ['red', 'blue'],
 *   ['big', 'small'],
 *   ['fast', 'slow'],
 * ])
 * // [
 * //   ['red', 'big', 'fast'],
 * //   ['red', 'big', 'slow'],
 * //   ['red', 'small', 'fast'],
 * //   ['red', 'small', 'slow'],
 * //   ['blue', 'big', 'fast'],
 * //   ['blue', 'big', 'slow'],
 * //   ['blue', 'small', 'fast'],
 * //   ['blue', 'small', 'slow']
 * // ]
 * ```
 * @version 12.3.0
 */
export function cartesianProduct<const T extends ReadonlyArray2D<any>>(
  ...arrays: [...T]
): Array<{ [K in keyof T]: T[K][number] }>

export function cartesianProduct<T extends ReadonlyArray2D<any>>(
  ...arrays: T
): T[][] {
  const numArrays = arrays.length
  if (numArrays === 0) {
    return [[]]
  }

  let total = 1
  for (let i = 0; i < numArrays; i++) {
    const len = arrays[i].length
    if (len === 0) {
      return []
    }
    total *= len
  }

  const out: any[][] = new Array(total)
  const lastIndex = numArrays - 1
  const lastArray = arrays[lastIndex]
  const lastLen = lastArray.length
  const indices: number[] = new Array(lastIndex)
  const current: any[] = new Array(lastIndex)
  for (let d = 0; d < lastIndex; d++) {
    indices[d] = 0
    current[d] = arrays[d][0]
  }

  let outIndex = 0
  while (outIndex < total) {
    for (let j = 0; j < lastLen; j++) {
      const tuple: any[] = new Array(numArrays)
      for (let d = 0; d < lastIndex; d++) {
        tuple[d] = current[d]
      }
      tuple[lastIndex] = lastArray[j]
      out[outIndex++] = tuple
    }

    for (let d = lastIndex - 1; d >= 0; d--) {
      const next = ++indices[d]
      if (next < arrays[d].length) {
        current[d] = arrays[d][next]
        break
      }
      indices[d] = 0
      current[d] = arrays[d][0]
    }
  }

  return out
}
