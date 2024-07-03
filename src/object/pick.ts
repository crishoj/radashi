/**
 * Pick a list of properties from an object into a new object
 */
export function pick<T extends object, TKeys extends keyof T>(
  obj: T,
  keys: TKeys[],
): Pick<T, TKeys> {
  return keys.reduce(
    (acc, key) => {
      if (Object.hasOwnProperty.call(obj, key)) {
        acc[key] = obj[key]
      }
      return acc
    },
    {} as Pick<T, TKeys>,
  )
}
