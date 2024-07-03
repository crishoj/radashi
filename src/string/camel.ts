import { capitalize } from 'radashi'

/**
 * Formats the given string in camel case fashion
 *
 * camel('hello world')   -> 'helloWorld' camel('va va-VOOM') ->
 * 'vaVaVoom' camel('helloWorld') -> 'helloWorld'
 */
export function camel(str: string): string {
  const parts = str
    .replace(/([A-Z])+/g, capitalize)
    .split(/(?=[A-Z])|[\.\-\s_]/)
    .map(x => x.toLowerCase())

  return parts.reduce((acc, part) => {
    return `${acc}${part.charAt(0).toUpperCase()}${part.slice(1)}`
  })
}
