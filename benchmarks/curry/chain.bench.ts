import * as _ from 'radashi'

describe('chain', () => {
  const addOne = (x: number) => x + 1
  const double = (x: number) => x * 2
  const subtractThree = (x: number) => x - 3

  bench('with 3 functions (repeated calls)', () => {
    const fn = _.chain(addOne, double, subtractThree)
    for (let i = 0; i < 100; i++) {
      fn(i)
    }
  })

  bench('with 3 functions (single call)', () => {
    const fn = _.chain(addOne, double, subtractThree)
    fn(5)
  })

  bench('with 6 functions (repeated calls)', () => {
    const fn = _.chain(
      addOne,
      double,
      subtractThree,
      addOne,
      double,
      subtractThree,
    )
    for (let i = 0; i < 100; i++) {
      fn(i)
    }
  })
})
