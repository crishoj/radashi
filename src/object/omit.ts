/**
 * Omit a list of properties from an object returning a new object
 * with the properties that remain
 */
export function omit<T, TKeys extends keyof T>(
  obj: T,
  keys: TKeys[],
): Omit<T, TKeys> {
  if (keys.length === 0) {
    return obj as Omit<T, TKeys>
  }
  return keys.reduce(
    (acc, key) => {
      // Gross, I know, it's mutating the object, but we are allowing
      // it in this very limited scope due to the performance
      // implications of an omit func. Not a pattern or practice to
      // use elsewhere.
      delete acc[key]
      return acc
    },
    { ...obj },
  )
}
