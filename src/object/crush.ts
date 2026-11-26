import { type Intersect, isArray, isObject, type Simplify } from 'radashi'

/**
 * Flattens a deep object to a single dimension, converting the keys
 * to dot notation.
 *
 * @see https://radashi.js.org/reference/object/crush
 * @example
 * ```ts
 * crush({ name: 'ra', children: [{ name: 'hathor' }] })
 * // { name: 'ra', 'children.0.name': 'hathor' }
 * ```
 * @version 12.1.0
 */
export function crush<T extends object>(value: T): Crush<T> {
  const crushed: Record<string, unknown> = {}
  crushObject(crushed, value as Record<string, unknown>, '')
  return crushed as Crush<T>
}

function crushObject(
  crushed: Record<string, unknown>,
  obj: Record<string, unknown>,
  prefix: string,
): boolean {
  const keys = Object.keys(obj)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const value = obj[key]
    const path = prefix + key
    if (
      typeof value === 'object' &&
      value !== null &&
      (isArray(value) || isObject(value)) &&
      crushObject(crushed, value as Record<string, unknown>, `${path}.`)
    ) {
      continue
    }
    crushed[path] = value
  }
  return keys.length > 0
}

/**
 * The return type of the `crush` function.
 *
 * This type is limited by TypeScript's development. There's no
 * reliable way to detect if an object will pass `isObject` or not, so
 * we cannot infer the property types of nested objects that have been
 * crushed.
 *
 * @see https://radashi.js.org/reference/object/crush
 */
export type Crush<T> = T extends readonly (infer U)[]
  ? Record<string, U extends object ? unknown : U>
  : Simplify<
      Intersect<
        keyof T extends infer Prop
          ? Prop extends keyof T
            ? T[Prop] extends infer Value
              ?
                  | ([Extract<Value, object>] extends [never]
                      ? never
                      : Record<string, unknown>)
                  | ([Exclude<Value, object>] extends [never]
                      ? never
                      : [Extract<Value, object>] extends [never]
                        ? { [P in Prop]: Value }
                        : Record<string, unknown>)
              : never
            : never
          : never
      >
    >
