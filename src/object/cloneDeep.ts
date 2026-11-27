/**
 * A strategy for cloning objects with `cloneDeep`.
 *
 * Methods **must** call the `track` function with the new parent
 * object **before** looping over the input object's
 * properties/elements for cloning purposes. This protects against
 * circular references.
 *
 * Methods may return the input object to indicate that cloning should
 * be skipped.
 *
 * Methods may return null to indicate that the default cloning logic
 * should be used.
 * @version 12.2.0
 */
export interface CloningStrategy {
  cloneMap: <K, V>(
    parent: Map<K, V>,
    track: (newParent: Map<K, V>) => Map<K, V>,
    clone: <T>(value: T) => T,
  ) => Map<K, V> | null
  cloneSet: <T>(
    parent: Set<T>,
    track: (newParent: Set<T>) => Set<T>,
    clone: <T>(value: T) => T,
  ) => Set<T> | null
  cloneArray: <T>(
    parent: readonly T[],
    track: (newParent: T[]) => T[],
    clone: <T>(value: T) => T,
  ) => T[] | null
  cloneObject: <T extends object>(
    parent: T,
    track: (newParent: T) => T,
    clone: <T>(value: T) => T,
  ) => T | null
  cloneOther: <T>(
    parent: T,
    track: (newParent: T) => T,
    clone: <T>(value: T) => T,
  ) => T | null
}

export const DefaultCloningStrategy: CloningStrategy = {
  cloneMap<K, V>(
    input: Map<K, V>,
    track: (newParent: Map<K, V>) => Map<K, V>,
    clone: <T>(value: T) => T,
  ): Map<K, V> {
    const output = track(new Map())
    for (const [key, value] of input) {
      output.set(key, clone(value))
    }
    return output
  },
  cloneSet<T>(
    input: Set<T>,
    track: (newParent: Set<T>) => Set<T>,
    clone: <T>(value: T) => T,
  ): Set<T> {
    const output = track(new Set())
    for (const value of input) {
      output.add(clone(value))
    }
    return output
  },
  cloneArray<T>(
    input: readonly T[],
    track: (newParent: T[]) => T[],
    clone: <T>(value: T) => T,
  ): T[] {
    const len = input.length
    const output = track(new Array(len))
    for (let i = 0; i < len; i++) {
      const value = input[i]
      if (value !== undefined || i in input) {
        output[i] = clone(value)
      }
    }
    return output
  },
  cloneObject<T extends object>(
    input: T,
    track: (newParent: T) => T,
    clone: <T>(value: T) => T,
  ): T {
    const proto = Object.getPrototypeOf(input)
    const isPlain = proto === Object.prototype || proto === null
    const output: any = track(
      proto === Object.prototype ? {} : Object.create(proto),
    )
    const keys = Reflect.ownKeys(input)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      // By copying the property descriptors, we preserve computed
      // properties and non-enumerable properties.
      const descriptor = Object.getOwnPropertyDescriptor(input, key)!
      // Plain data properties can be assigned directly, unless the key
      // is inherited (e.g. `__proto__`, or `toString` on a frozen
      // Object.prototype), where assignment would hit the prototype.
      if (
        isPlain &&
        !(key in output) &&
        descriptor.writable &&
        descriptor.enumerable &&
        descriptor.configurable
      ) {
        output[key] = clone(descriptor.value)
      } else {
        if ('value' in descriptor) {
          descriptor.value = clone(descriptor.value)
        }
        Object.defineProperty(output, key, descriptor)
      }
    }
    return output
  },
  cloneOther<T>(input: T, track: (newParent: T) => T): T {
    return track(input)
  },
}

/**
 * If you don't need support for non-enumerable properties or computed
 * properties, and you're not using custom classes, you can use this
 * strategy for better performance.
 */
export const FastCloningStrategy = {
  cloneObject: <T extends object>(
    input: T,
    track: (newParent: T) => T,
    clone: <T>(value: T) => T,
  ): T => {
    const output: any = track({ ...input })
    for (const key in output) {
      if (Object.prototype.hasOwnProperty.call(output, key)) {
        output[key] = clone(output[key])
      }
    }
    return output
  },
}

/**
 * Clone the given object and possibly other objects nested inside.
 *
 * By default, the only objects that get cloned are plain objects,
 * non-native class instances, arrays, `Set` instances, and `Map`
 * instances. If an object is not cloned, any objects nested inside
 * are also not cloned.
 *
 * You may define a custom cloning strategy by passing a partial
 * implementation of the `CloningStrategy` interface to the
 * `cloneDeep` function. Any undefined methods will fall back to the
 * default cloning logic. Your own methods may return null to indicate
 * that the default cloning logic should be used. They may also return
 * the input object to indicate that cloning should be skipped.
 *
 * ```ts
 * const obj = { a: 1, b: { c: 2 } }
 * const clone = cloneDeep(obj)
 *
 * assert(clone !== obj)
 * assert(clone.b !== obj.b)
 * assert(JSON.stringify(clone) === JSON.stringify(obj))
 * ```
 */
export function cloneDeep<T extends object>(
  root: T,
  customStrategy?: Partial<CloningStrategy>,
): T {
  const isBuiltin = !customStrategy || customStrategy === FastCloningStrategy
  const strategy = customStrategy
    ? { ...DefaultCloningStrategy, ...customStrategy }
    : DefaultCloningStrategy

  const tracked = new Map<unknown, unknown>()
  let currentParent: unknown
  const defaultTrack = <T>(copy: T): T => {
    tracked.set(currentParent, copy)
    return copy
  }

  const clone = <T>(value: T): T =>
    value && typeof value === 'object'
      ? ((tracked.get(value) ?? cloneNode(value, strategy)) as T)
      : value

  const cloneCustom = (
    parent: unknown,
    cloneParent: (
      parent: any,
      track: (newParent: any) => any,
      clone: <T>(value: T) => T,
    ) => unknown,
  ): unknown => {
    let trackedValue: unknown
    const newParent = cloneParent(
      parent,
      copy => {
        trackedValue = copy
        tracked.set(parent, copy)
        return copy
      },
      clone,
    )
    if (!newParent) {
      // Use the default strategy if null is returned.
      return cloneNode(parent, DefaultCloningStrategy)
    }
    if (trackedValue !== newParent) {
      tracked.set(parent, newParent)
    }
    return newParent
  }

  const cloneNode = (parent: unknown, strategy: CloningStrategy): unknown => {
    let cloneParent: (
      parent: any,
      track: (newParent: any) => any,
      clone: <T>(value: T) => T,
    ) => unknown

    if (Array.isArray(parent)) {
      cloneParent = strategy.cloneArray
    } else {
      const tag = Object.prototype.toString.call(parent)
      cloneParent =
        tag === '[object Object]'
          ? strategy.cloneObject
          : tag === '[object Map]'
            ? strategy.cloneMap
            : tag === '[object Set]'
              ? strategy.cloneSet
              : strategy.cloneOther
    }

    if (isBuiltin || strategy === DefaultCloningStrategy) {
      currentParent = parent
      return cloneParent(parent, defaultTrack, clone)
    }
    return cloneCustom(parent, cloneParent)
  }

  return cloneNode(root, strategy) as T
}
