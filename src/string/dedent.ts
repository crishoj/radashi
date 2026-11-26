import { isArray } from 'radashi'

const embeddedNlRe = /\n(?=[^\n]*?\S)/g
const wsRe = /\s/

/**
 * Remove indentation from a string. The given string is expected to
 * be consistently indented (i.e. the leading whitespace of the first
 * non-empty line is the minimum required for all non-empty lines).
 *
 * If the `indent` argument is nullish, the indentation is detected
 * from the first non-empty line. Detection is cheap and robust for
 * most use cases, so you should only set an explicit `indent` if
 * necessary.
 *
 * @see https://radashi.js.org/reference/string/dedent
 * @example
 * ```ts
 * // This is indented with 4 spaces.
 * const input = `
 *     Hello
 *     World
 * `
 *
 * // Explicit indentation
 * dedent(input, '  ')
 * // => '  Hello\n  World\n'
 *
 * // Detected indentation
 * dedent(input)
 * // => 'Hello\nWorld\n'
 *
 * // Tagged template strings
 * const str = dedent`
 *   Foo ${1 + 1}
 *   Bar ${2 * 2}
 * `
 * // => 'Foo 2\nBar 4'
 * ```
 * @version 12.3.0
 */
export function dedent(
  template: TemplateStringsArray,
  ...values: unknown[]
): string

export function dedent(text: string, indent?: string | null): string

/* @__NO_SIDE_EFFECTS__ */
export function dedent(
  text: string | TemplateStringsArray,
  ...values: unknown[]
): string {
  let str = text as string
  let indent = values[0] as string | null | undefined

  // Support tagged template strings
  if (isArray(text)) {
    indent = undefined
    str = text[0]
    for (let i = 0; i < text.length - 1; i++) {
      const raw = values[i]
      if (raw != null) {
        let value = String(raw)
        if (value.includes('\n')) {
          // Detect the indentation before this embedded string.
          const input = text[i]
          const indentStart = input.lastIndexOf('\n') + 1
          const indentEnd = skipSpaces(input, indentStart, input.length)
          if (indentEnd > indentStart) {
            // Ensure the multi-line, embedded string can be correctly
            // dedented.
            value = value.replace(
              embeddedNlRe,
              '\n' + input.slice(indentStart, indentEnd),
            )
          }
        }
        str += value
      }
      str += text[i + 1]
    }
  }

  // Remove the first and last lines if empty (after stripping any explicit
  // indent; auto-detected indent is only spaces/tabs so blankness is invariant).
  const firstNl = str.indexOf('\n')
  let start =
    firstNl !== -1 && isBlank(str, 0, firstNl, indent) ? firstNl + 1 : 0

  let end = str.length
  const lastNl = str.lastIndexOf('\n')
  if (lastNl >= start && isBlank(str, lastNl + 1, end, indent)) {
    end = lastNl
  }

  // If no indent is provided, detect it from the first non-empty line.
  let needle = ''
  if (indent == null) {
    indent = ''
    for (let pos = start; pos < end; ) {
      const p = skipSpaces(str, pos, end)
      if (p < end) {
        const c = str.charCodeAt(p)
        if ((c < 10 || c > 13) && (c < 160 || !wsRe.test(str[p]))) {
          indent = str.slice(pos, p)
          if (pos > 0) {
            needle = str.slice(pos - 1, p)
          }
          break
        }
      }
      pos = str.indexOf('\n', p) + 1
      if (pos === 0) {
        break
      }
    }
  }

  // Note: Lines with an indent less than the removed indent will not
  // be changed.
  let out = ''
  if (indent && start < end) {
    const indentLen = indent.length
    if (start + indentLen <= end && str.startsWith(indent, start)) {
      start += indentLen
    }
    needle ||= '\n' + indent
    let idx: number
    while ((idx = str.indexOf(needle, start)) !== -1 && idx + indentLen < end) {
      out += str.slice(start, idx + 1)
      start = idx + indentLen + 1
    }
  }

  return out + str.slice(start, end)
}

function skipSpaces(str: string, pos: number, end: number): number {
  while (
    pos < end &&
    (str.charCodeAt(pos) === 32 || str.charCodeAt(pos) === 9)
  ) {
    pos++
  }
  return pos
}

function isBlank(
  str: string,
  pos: number,
  end: number,
  indent: string | null | undefined,
): boolean {
  if (indent && str.startsWith(indent, pos)) {
    pos += indent.length
  }
  return skipSpaces(str, pos, end) === end
}
