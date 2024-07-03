import { capitalize } from 'radashi'

/**
 * Formats the given string in title case fashion
 *
 * title('hello world') -> 'Hello World' title('va_va_boom') -> 'Va Va
 * Boom' title('root-hook') -> 'Root Hook' title('queryItems') ->
 * 'Query Items'
 */
export function title(str: string): string {
  return str
    .split(/(?=[A-Z])|[\.\-\s_]/)
    .map(s => s.trim())
    .filter(s => !!s)
    .map(s => capitalize(s.toLowerCase()))
    .join(' ')
}
