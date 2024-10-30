/**
 * Extract a property from an object array.
 *
 * @see https://radashi.js.org/reference/array/pluck
 * @example
 * ```ts
 * const countries = [
 *   { name: 'France', capital: 'Paris'  },
 *   { name: 'Spain',  capital: 'Madrid' },
 *   { name: 'Italy',  capital: 'Rome'   }
 * ]
 * pluck(countries, 'name')
 * // => ['France', 'Spain', 'Italy']
 * ```
 */
export function pluck<T extends object, K extends keyof T>(
  objects: T[],
  key: K,
): T[K][] {
  return objects.map(obj => obj[key])
}
