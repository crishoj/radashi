const CHARACTERS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

/**
 * Generate a random string of a given length.
 *
 * @see https://radashi.js.org/reference/random/uid
 * @example
 * ```ts
 * uid(8)
 * // => "a3fSDf32"
 * ```
 * @version 12.1.0
 */
export function uid(length: number, specials = ''): string {
  const characters = specials ? CHARACTERS + specials : CHARACTERS
  const max = characters.length
  let result = ''
  for (let i = 1; i <= length; i++) {
    result += characters[(Math.random() * max) | 0]
  }
  return result
}
