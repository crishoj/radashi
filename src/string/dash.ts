import { capitalize } from 'radashi'

/**
 * Formats the given string in dash case fashion
 *
 * dash('hello world')   -> 'hello-world' dash('va va_VOOM') ->
 * 'va-va-voom' dash('helloWord') -> 'hello-word'
 */
export function dash(str: string): string {
  const parts = str
    .replace(/([A-Z])+/g, capitalize)
    .split(/(?=[A-Z])|[\.\-\s_]/)
    .map(x => x.toLowerCase())

  return parts.reduce((acc, part) => {
    return `${acc}-${part.toLowerCase()}`
  })
}
