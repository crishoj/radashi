import { isArray, isPlainObject } from 'radashi'

function collectKeys(value: any, prefix: string, out: string[]): void {
  const isObject = isPlainObject(value)
  if (isObject || isArray(value)) {
    const props: any[] = isObject ? Object.keys(value) : value
    for (let i = 0; i < props.length; i++) {
      // Skip sparse array holes, like `Array#forEach` does.
      if (isObject || i in value) {
        const key = isObject ? props[i] : i
        const item = (value as any)[key]
        const path = prefix + key
        if (typeof item === 'object' && item !== null) {
          collectKeys(item, path + '.', out)
        } else {
          out.push(path)
        }
      }
    }
  } else {
    out.push(prefix.slice(0, -1))
  }
}

/**
 * Get a string list of all key names that exist in an object (deep).
 *
 * @see https://radashi.js.org/reference/object/keys
 * @example
 * ```ts
 * keys({ name: 'ra' }) // ['name']
 *
 * keys({ name: 'ra', children: [{ name: 'hathor' }] })
 * // ['name', 'children.0.name']
 * ```
 * @version 12.1.0
 */
export function keys(value: object): string[] {
  const out: string[] = []
  collectKeys(value, '', out)
  return out
}
