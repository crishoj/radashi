/**
 * Trims all prefix and suffix characters from the given string. Like
 * the builtin trim function but accepts other characters you would
 * like to trim and trims multiple characters.
 *
 * @see https://radashi.js.org/reference/string/trim
 * @example
 * ```ts
 * trim('  hello ') // => 'hello'
 * trim('__hello__', '_') // => 'hello'
 * trim('/repos/:owner/:repo/', '/') // => 'repos/:owner/:repo'
 * trim('222222__hello__1111111', '12_') // => 'hello'
 * ```
 * @version 12.1.0
 */
export function trim(str: string, charsToTrim: string): string {
  // Read both lengths up front so nullish arguments throw, as before.
  const charsLen = charsToTrim.length
  let start = 0
  let end = str.length

  while (
    start < end &&
    includes(charsToTrim, charsLen, str.charCodeAt(start))
  ) {
    start++
  }
  while (
    end > start &&
    includes(charsToTrim, charsLen, str.charCodeAt(end - 1))
  ) {
    end--
  }

  return str.slice(start, end)
}

function includes(chars: string, length: number, code: number): boolean {
  for (let i = 0; i < length; i++) {
    if (chars.charCodeAt(i) === code) {
      return true
    }
  }
  return false
}
