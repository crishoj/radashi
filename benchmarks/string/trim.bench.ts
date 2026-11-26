import * as _ from 'radashi'

describe('trim', () => {
  const longSingle = [
    '_'.repeat(50),
    'hello_world_'.repeat(50),
    '_'.repeat(50),
  ].join('')
  const longMulti = [
    '_- '.repeat(30),
    'hello_world_'.repeat(50),
    '_- '.repeat(30),
  ].join('')

  bench('with valid input', () => {
    _.trim(' hello  ', ' ')
  })

  bench('with a specified character', () => {
    _.trim('__hello__', '_')
  })

  bench('with two special characters', () => {
    _.trim('_- hello_- ', '_- ')
  })

  bench('with multiple whitespace characters', () => {
    _.trim('\n\n\t\nhello\n\t  \n', '\n\t ')
  })

  bench('with no-op input', () => {
    _.trim('hello_world', '_- ')
  })

  bench('with long string (single char)', () => {
    _.trim(longSingle, '_')
  })

  bench('with long string (multi char)', () => {
    _.trim(longMulti, '_- ')
  })
})
