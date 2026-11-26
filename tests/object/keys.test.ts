import * as _ from 'radashi'

describe('keys', () => {
  test('returns correct list of keys', () => {
    const ra = {
      name: 'ra',
      power: 100,
      friend: {
        name: 'loki',
        power: 80,
      },
      enemies: [
        {
          name: 'hathor',
          power: 12,
        },
      ],
    }
    expect(_.keys(ra)).toEqual([
      'name',
      'power',
      'friend.name',
      'friend.power',
      'enemies.0.name',
      'enemies.0.power',
    ])
  })
  test('works with Object.create(null)', () => {
    const object = Object.create(null)
    object.a = 1
    object.b = [2]
    object.c = { d: 3 }
    const result = _.keys(object)
    expect(result).toEqual(['a', 'b.0', 'c.d'])
  })
  test('returns empty array for empty root object or array', () => {
    expect(_.keys({})).toEqual([])
    expect(_.keys([])).toEqual([])
  })
  test('omits empty nested objects and arrays', () => {
    expect(_.keys({ a: {}, b: [], c: 1 })).toEqual(['c'])
  })
  test('treats non-plain objects and primitives as leaves', () => {
    expect(_.keys(new Date())).toEqual([''])
    expect(_.keys(new Map())).toEqual([''])
    expect(_.keys(null as any)).toEqual([''])
    expect(_.keys(42 as any)).toEqual([''])
    expect(
      _.keys({
        date: new Date(),
        map: new Map(),
        nil: null,
        arr: [new Date()],
      }),
    ).toEqual(['date', 'map', 'nil', 'arr.0'])
  })
  test('skips sparse array holes while keeping undefined entries', () => {
    const sparse: (number | undefined)[] = new Array(4)
    sparse[0] = 1
    sparse[1] = undefined
    sparse[3] = 4
    expect(_.keys(sparse)).toEqual(['0', '1', '3'])
    expect(_.keys({ sparse })).toEqual(['sparse.0', 'sparse.1', 'sparse.3'])
  })
  test('handles empty string keys', () => {
    expect(_.keys({ '': 1 })).toEqual([''])
    expect(_.keys({ '': new Date() })).toEqual([''])
    expect(_.keys({ '': { a: 1 } })).toEqual(['.a'])
    expect(_.keys({ '': { '': 1 } })).toEqual(['.'])
    expect(_.keys({ a: { '': 1 } })).toEqual(['a.'])
    expect(_.keys({ a: { '': { b: 1 } } })).toEqual(['a..b'])
    expect(_.keys({ '': [1] })).toEqual(['.0'])
  })
})
