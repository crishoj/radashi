import * as _ from 'radashi'

describe('isEmpty', () => {
  class Data {}
  class Person {
    name = 'ray'
  }
  test('returns true for empty values', () => {
    expect(_.isEmpty(null)).toBeTruthy()
    expect(_.isEmpty(undefined)).toBeTruthy()
    expect(_.isEmpty(new Data())).toBeTruthy()
    expect(_.isEmpty(0)).toBeTruthy()
    expect(_.isEmpty(0n)).toBeTruthy()
    expect(_.isEmpty(true)).toBeTruthy()
    expect(_.isEmpty([])).toBeTruthy()
    expect(_.isEmpty(false)).toBeTruthy()
    expect(_.isEmpty({})).toBeTruthy()
    expect(_.isEmpty('')).toBeTruthy()
    expect(_.isEmpty(String())).toBeTruthy()
    expect(_.isEmpty(new Map())).toBeTruthy()
    expect(_.isEmpty(new Set())).toBeTruthy()
    expect(_.isEmpty({ length: 0 })).toBeTruthy()
    expect(_.isEmpty(new Date('invalid value'))).toBeTruthy()
    expect(_.isEmpty(Number.NaN)).toBeTruthy()
    expect(_.isEmpty(Object.create(null))).toBeTruthy()
    expect(_.isEmpty(Object.create({ inherited: 1 }))).toBeTruthy()
    const crossRealmInvalidDate = Object.setPrototypeOf(
      new Date('invalid value'),
      { getTime: Date.prototype.getTime },
    )
    expect(_.isEmpty(crossRealmInvalidDate)).toBeTruthy()
  })
  test('returns false for non-empty values', () => {
    expect(_.isEmpty(new Date())).toBeFalsy()
    expect(_.isEmpty(new Date('2022-09-01T02:19:55.976Z'))).toBeFalsy()
    const crossRealmDate = Object.setPrototypeOf(new Date(), {
      getTime: Date.prototype.getTime,
    })
    expect(_.isEmpty(crossRealmDate)).toBeFalsy()
    expect(_.isEmpty({ getTime: () => 0 })).toBeFalsy()
    expect(_.isEmpty(Object.assign(Object.create(null), { a: 1 }))).toBeFalsy()
    expect(_.isEmpty({ a: 1, b: 2, c: 3 })).toBeFalsy()
    expect(_.isEmpty(22)).toBeFalsy()
    expect(_.isEmpty(-22)).toBeFalsy()
    expect(_.isEmpty(1n)).toBeFalsy()
    expect(_.isEmpty(new Person())).toBeFalsy()
    expect(_.isEmpty({ name: 'x' })).toBeFalsy()
    expect(_.isEmpty({ length: 2 })).toBeFalsy()
    expect(_.isEmpty('abc')).toBeFalsy()
    expect(_.isEmpty(String('abc'))).toBeFalsy()
    expect(_.isEmpty([1, 2, 3])).toBeFalsy()
    expect(_.isEmpty(function work() {})).toBeFalsy()
    expect(_.isEmpty(() => {})).toBeFalsy()
    expect(_.isEmpty(Symbol(''))).toBeFalsy()
    expect(_.isEmpty(Symbol('hello'))).toBeFalsy()
    const map = new Map()
    map.set('a', 1)
    expect(_.isEmpty(map)).toBeFalsy()
    expect(_.isEmpty(new Set([1]))).toBeFalsy()
  })
})
