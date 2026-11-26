/**
 * Given two arrays, returns true if any elements intersect.
 *
 * @see https://radashi.js.org/reference/array/intersects
 * @example
 * ```ts
 * intersects([1, 2, 3], [4, 5, 6])
 * // false
 *
 * intersects([1, 0, 0], [0, 1], (n) => n > 1)
 * // true
 * ```
 * @version 12.1.0
 */
export function intersects<T, K>(
  listA: readonly T[],
  listB: readonly T[],
  identity?: (t: T) => K,
): boolean {
  if (listA.length === 0 || listB.length === 0) {
    return false
  }
  if (identity) {
    return intersectsWithIdentity(listA, listB, identity)
  }
  if (listA.length > 16 && listB.length > 16) {
    return intersectsWithSet(listA, listB)
  }
  for (let i = 0; i < listB.length; i++) {
    if (listA.includes(listB[i])) {
      return true
    }
  }
  return false
}

function intersectsWithIdentity<T, K>(
  listA: readonly T[],
  listB: readonly T[],
  identity: (t: T) => K,
): boolean {
  let smaller = listA
  let larger = listB
  if (listA.length > listB.length) {
    smaller = listB
    larger = listA
  }
  if (smaller.length === 1) {
    const target = identity(smaller[0])
    const isTargetNaN = Number.isNaN(target)
    for (let i = 0; i < larger.length; i++) {
      const key = identity(larger[i])
      if (key === target || (isTargetNaN && Number.isNaN(key))) {
        return true
      }
    }
    return false
  }
  const known = new Set<K>()
  for (let i = 0; i < smaller.length; i++) {
    known.add(identity(smaller[i]))
  }
  for (let i = 0; i < larger.length; i++) {
    if (known.has(identity(larger[i]))) {
      return true
    }
  }
  return false
}

function intersectsWithSet<T>(
  listA: readonly T[],
  listB: readonly T[],
): boolean {
  let smaller = listA
  let larger = listB
  if (listA.length > listB.length) {
    smaller = listB
    larger = listA
  }
  const known = new Set<T>()
  for (let i = 0; i < smaller.length; i++) {
    known.add(smaller[i])
  }
  for (let i = 0; i < larger.length; i++) {
    if (known.has(larger[i])) {
      return true
    }
  }
  return false
}
