import { isDangerousKey, isIntString, set } from 'radashi'

/**
 * The opposite of crush, given an object that was crushed into key
 * paths and values will return the original object reconstructed.
 *
 * @see https://radashi.js.org/reference/object/construct
 * @example
 * ```ts
 * construct({ name: 'ra', 'children.0.name': 'hathor' })
 * // { name: 'ra', children: [{ name: 'hathor' }] }
 * ```
 * @version 12.1.0
 */
export function construct<TObject extends object>(obj: TObject): object {
  const result: any = {}
  const paths = Object.keys(obj)
  // Objects and functions taken from `obj`. These must not be mutated,
  // so writes into them are delegated to `set`, which clones.
  let external: Set<object> | undefined

  for (let i = 0; i < paths.length; i++) {
    const keys = paths[i].match(/[^.[\]]+/g)
    if (!keys) {
      continue
    }
    let value = (obj as any)[paths[i]]
    let current = result
    let k = 0
    let key = keys[0]

    while (true) {
      if (isDangerousKey(key)) {
        throw new Error('Unsafe key in path: ' + key)
      }
      if (++k === keys.length) {
        // Like `set`, don't create a key just to hold undefined.
        if (value === undefined && current[key] === undefined) {
          break
        }
      } else {
        const next = current[key]
        if (
          next == null ||
          ((typeof next === 'object' || typeof next === 'function') &&
            !external?.has(next))
        ) {
          // Descend into (or create) a container we own.
          current = next ?? (current[key] = isIntString(keys[k]) ? [] : {})
          key = keys[k]
          continue
        }
        // A primitive or external intermediate: let `set` decide.
        value = set(next, keys.slice(k).join('.'), value)
      }
      current[key] = value
      if (value && (typeof value === 'object' || typeof value === 'function')) {
        ;(external ??= new Set()).add(value)
      }
      break
    }
  }

  return result
}
