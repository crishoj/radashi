import * as _ from 'radashi'

describe('isEmpty', () => {
  bench('with null', () => {
    _.isEmpty(null)
  })

  bench('with empty object', () => {
    _.isEmpty({})
  })

  bench('with empty string', () => {
    _.isEmpty('')
  })

  bench('with non-empty object', () => {
    _.isEmpty({ name: 'x' })
  })

  bench('with non-empty string', () => {
    _.isEmpty('abc')
  })

  const multiKeyObj = {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    e: 5,
    f: 6,
    g: 7,
    h: 8,
    i: 9,
    j: 10,
  }

  bench('with multi-key object', () => {
    _.isEmpty(multiKeyObj)
  })

  const array = [1, 2, 3]

  bench('with array', () => {
    _.isEmpty(array)
  })

  const map = new Map([['a', 1]])

  bench('with Map', () => {
    _.isEmpty(map)
  })
})
