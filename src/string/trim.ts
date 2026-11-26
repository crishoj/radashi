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
  if (!str || !charsToTrim) {
    return str
  }

  if (charsToTrim.length === 1) {
    return trimSingle(str, charsToTrim.charCodeAt(0))
  }

  return trimMulti(str, charsToTrim)
}

function trimSingle(str: string, code: number): string {
  let start = 0
  let end = str.length

  while (start < end && str.charCodeAt(start) === code) {
    start++
  }

  while (end > start && str.charCodeAt(end - 1) === code) {
    end--
  }

  return start === 0 && end === str.length ? str : str.slice(start, end)
}

function trimMulti(str: string, charsToTrim: string): string {
  let start = 0
  let end = str.length
  const charsLen = charsToTrim.length

  while (start < end) {
    const code = str.charCodeAt(start)
    let i = 0
    while (i < charsLen && charsToTrim.charCodeAt(i) !== code) {
      i++
    }
    if (i === charsLen) {
      break
    }
    start++
  }

  while (end > start) {
    const code = str.charCodeAt(end - 1)
    let i = 0
    while (i < charsLen && charsToTrim.charCodeAt(i) !== code) {
      i++
    }
    if (i === charsLen) {
      break
    }
    end--
  }

  return start === 0 && end === str.length ? str : str.slice(start, end)
}
