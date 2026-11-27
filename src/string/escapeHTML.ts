const htmlCharacters = /[&<>"']/g
const replacements: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

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
  // Manual `exec` loop instead of `replace` with a callback: one native
  // scan, no per-match callback, and no allocation when nothing matches.
  // The loop always runs until `exec` returns null, which resets the
  // regex's `lastIndex` to 0 for the next call.
  let result = ''
  let lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = htmlCharacters.exec(input))) {
    result += input.slice(lastIndex, match.index)
    result += replacements[match[0]]
    lastIndex = htmlCharacters.lastIndex
  }
  return lastIndex ? result + input.slice(lastIndex) : input
}
