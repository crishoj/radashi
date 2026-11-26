import * as _ from 'radashi'

describe('uid', () => {
  bench('with valid input', () => {
    _.uid(10)
  })

  bench('with special characters', () => {
    _.uid(20, '_-+~')
  })

  bench('long string', () => {
    _.uid(64)
  })
})
