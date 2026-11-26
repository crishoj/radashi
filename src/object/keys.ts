import { isArray, isPlainObject } from 'radashi'

function collectKeys(value: any, prefix: string, out: string[]): void {
  if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      if (i in value) {
        const item = value[i]
        const path = prefix + i
        if (typeof item === 'object' && item !== null) {
          collectKeys(item, path + '.', out)
        } else {
          out.push(path)
        }
      }
    }
    return
  }
  if (isPlainObject(value)) {
    const objKeys = Object.keys(value)
    for (let i = 0; i < objKeys.length; i++) {
      const key = objKeys[i]
      const propValue = (value as Record<string, any>)[key]
      const path = prefix + key
      if (typeof propValue === 'object' && propValue !== null) {
        collectKeys(propValue, path + '.', out)
      } else {
        out.push(path)
      }
    }
    return
  }
  out.push(prefix.slice(0, -1))
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
