import * as _ from 'radashi'

describe('pluck', () => {
  test('type narrowing', () => {
    const array = [
      { a: 1, b: false },
      { a: 2, b: true },
    ]
    expectTypeOf(_.pluck(array, 'a')).toEqualTypeOf<number[]>()
    expectTypeOf(_.pluck(array, 'b')).toEqualTypeOf<boolean[]>()
  })
})
