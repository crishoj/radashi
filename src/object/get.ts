function step(
  current: any,
  path: string,
  start: number,
  end: number,
  quoteCount: number,
  hasNonSpace: boolean,
): any {
  let key: string
  if (quoteCount === 0) {
    key = start === 0 && end === path.length ? path : path.slice(start, end)
  } else {
    const first = path.charCodeAt(start)
    const last = path.charCodeAt(end - 1)
    key =
      quoteCount === 2 &&
      (first === 34 || first === 39) &&
      (last === 34 || last === 39)
        ? path.slice(start + 1, end - 1)
        : path.slice(start, end).replace(/['"]/g, '')
  }
  return hasNonSpace || key.trim() !== '' ? current[key] : current
}

/**
 * Dynamically get a nested value from an array or object with a
 * string.
 *
 * @see https://radashi.js.org/reference/object/get
 * @example
 * ```ts
 * const person = {
 *   name: 'John',
 *   friends: [{ name: 'Jane' }]
 * }
 *
 * get(person, 'friends[0].name')
 * // => 'Jane'
 * ```
 * @version 12.1.0
 */
export function get<TDefault = unknown>(
  value: any,
  path: string,
  defaultValue?: TDefault,
): TDefault {
  if (value === null || value === undefined) {
    return defaultValue as TDefault
  }

  let current: any = value
  const len = path.length
  let start = 0
  let quoteCount = 0
  let hasNonSpace = false
  let hasHigh = false
  let num = -1

  for (let i = 0; i < len; i++) {
    const code = path.charCodeAt(i)
    if (code > 93 && code < 160) {
      hasNonSpace = true
      num = -2
    } else if (code === 46 || code === 91 || code === 93) {
      if (num >= 0) {
        current = current[num]
      } else if (hasNonSpace || hasHigh) {
        current = step(current, path, start, i, quoteCount, hasNonSpace)
      }
      if (current === null || current === undefined) {
        return defaultValue as TDefault
      }
      start = i + 1
      quoteCount = 0
      hasNonSpace = false
      hasHigh = false
      num = -1
    } else if (code >= 48 && code <= 57) {
      hasNonSpace = true
      if (num === -1) {
        num = code - 48
      } else if (num > 0 && num < 100_000_000) {
        num = num * 10 + (code - 48)
      } else {
        num = -2
      }
    } else if (code === 34 || code === 39) {
      quoteCount++
    } else {
      num = -2
      if (code >= 160) {
        hasHigh = true
      } else if (code !== 32 && (code < 9 || code > 13)) {
        hasNonSpace = true
      }
    }
  }

  if (num >= 0) {
    current = current[num]
  } else if (hasNonSpace || hasHigh) {
    current = step(current, path, start, len, quoteCount, hasNonSpace)
  }

  return current === undefined ? (defaultValue as TDefault) : current
}
