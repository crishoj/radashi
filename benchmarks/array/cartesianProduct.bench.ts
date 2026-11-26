import * as _ from 'radashi'

describe('cartesianProduct', () => {
  const a5 = [1, 2, 3, 4, 5]
  const b5 = ['a', 'b', 'c', 'd', 'e']
  const c5 = [true, false, null, 0, 1]
  const d5 = [10, 20, 30, 40, 50]
  const big1 = Array.from({ length: 50 }, (_, i) => i)
  const big2 = Array.from({ length: 50 }, (_, i) => i)

  bench('with an empty array (n=1)', () => {
    _.cartesianProduct([])
  })

  bench('with a non-empty array (n=1)', () => {
    _.cartesianProduct(['a', 'b', 'c'])
  })

  bench('with two small arrays (n=2)', () => {
    _.cartesianProduct(['red', 'blue'], ['fast', 'slow'])
  })

  bench('with three small arrays (n=3)', () => {
    _.cartesianProduct(['red', 'blue'], ['fast', 'slow'], ['big', 'small'])
  })

  bench('with four arrays of size 5 (n=4)', () => {
    _.cartesianProduct(a5, b5, c5, d5)
  })

  bench('with a trailing empty array (n=3)', () => {
    _.cartesianProduct(big1, big2, [])
  })
})
