const htmlCharacters = /[&<>"']/

/**
 * Escape HTML characters in a string.
 *
 * @see https://radashi.js.org/reference/string/escapeHTML
 * @example
 * ```ts
 * escapeHTML('<div>Hello, world!</div>')
 * // => '&lt;div&gt;Hello, world!&lt;/div&gt;'
 * ```
 * @version 12.6.0
 */
export function escapeHTML(input: string): string {
  let i = input.search(htmlCharacters)
  if (i === -1) {
    return input
  }

  let result = ''
  let lastIndex = 0
  const len = input.length

  for (; i < len; i++) {
    const code = input.charCodeAt(i)
    if (code > 62) {
      continue
    }

    let escaped: string
    switch (code) {
      case 34:
        escaped = '&quot;'
        break
      case 38:
        escaped = '&amp;'
        break
      case 39:
        escaped = '&#39;'
        break
      case 60:
        escaped = '&lt;'
        break
      case 62:
        escaped = '&gt;'
        break
      default:
        continue
    }

    if (lastIndex !== i) {
      result += input.slice(lastIndex, i)
    }
    result += escaped
    lastIndex = i + 1
  }

  return lastIndex < len ? result + input.slice(lastIndex) : result
}
