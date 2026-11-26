import { isDangerousKey, isIntString, set } from 'radashi'

function scan(path: string, pos: number, delim: boolean): number {
  while (pos < path.length) {
    const c = path.charCodeAt(pos)
    if ((c <= 93 && (c === 46 || c === 91 || c === 93)) !== delim) {
      break
    }
    pos++
  }
  return pos
}

function isObjectLike(value: unknown): value is object {
  return (
    value !== null && (typeof value === 'object' || typeof value === 'function')
  )
}

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
  const last = paths.length - 1
  let external: Set<object> | undefined

  for (let i = 0; i <= last; i++) {
    const path = paths[i]
    const len = path.length
    let pos = scan(path, 0, true)
    if (pos === len) {
      continue
    }

    let start = pos
    pos = scan(path, pos, false)

    let value = (obj as any)[path]
    let key = start === 0 && pos === len ? path : path.slice(start, pos)
    let current: any = result

    while (true) {
      if (isDangerousKey(key)) {
        throw new Error('Unsafe key in path: ' + key)
      }

      pos = scan(path, pos, true)
      if (pos === len) {
        if (value === undefined && current[key] === undefined) {
          break
        }
      } else {
        start = pos
        pos = scan(path, pos, false)
        const nextKey = path.slice(start, pos)
        const next = current[key]

        if (next == null || (isObjectLike(next) && !external?.has(next))) {
          current = next ?? (current[key] = isIntString(nextKey) ? [] : {})
          key = nextKey
          continue
        }

        value = set(next, path.slice(start), value)
      }

      current[key] = value
      if (i < last && isObjectLike(value)) {
        external ??= new Set()
        external.add(value)
      }
      break
    }
  }

  return result
}
