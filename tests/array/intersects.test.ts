import * as _ from 'radashi'

describe('intersects', () => {
  test('returns true if list a & b have items in common', () => {
    const listA = ['a', 'b']
    const listB = [1, 2, 'b', 'x']
    const result = _.intersects(listA, listB)
    expect(result).toBeTruthy()
  })
  test('returns false if list a & b have no items in common', () => {
    const listA = ['a', 'b', 'c']
    const listB = ['x', 'y']
    const result = _.intersects(listA, listB)
    expect(result).toBeFalsy()
  })
  test('returns false when either list is empty', () => {
    expect(_.intersects([], [1, 2, 3])).toBe(false)
    expect(_.intersects([1, 2, 3], [])).toBe(false)
    expect(_.intersects([], [])).toBe(false)
    expect(_.intersects([], [{ value: 1 }], x => x.value)).toBe(false)
    expect(_.intersects([{ value: 1 }], [], x => x.value)).toBe(false)
  })
  test('returns true using custom identity', () => {
    const listA = [{ value: 23 }, { value: 12 }]
    const listB = [{ value: 12 }]
    const result = _.intersects(listA, listB, x => x.value)
    expect(result).toBeTruthy()
  })
  test('works with custom identity for multi-item and disjoint lists', () => {
    const listA = [{ value: 1 }, { value: 2 }]
    const listB = [{ value: 3 }, { value: 4 }, { value: 2 }]
    const listC = [{ value: 5 }, { value: 6 }]

    expect(_.intersects(listA, listB, x => x.value)).toBe(true)
    expect(_.intersects(listB, listA, x => x.value)).toBe(true)
    expect(_.intersects(listA, listC, x => x.value)).toBe(false)
    expect(
      _.intersects([{ value: 1 }], [{ value: 2 }, { value: 3 }], x => x.value),
    ).toBe(false)
  })
  test('works with objects without an identity function', () => {
    const obj1 = { id: 1 }
    const obj2 = { id: 2 }
    const obj3 = { id: 3 }

    let result = _.intersects([obj1, obj2], [obj2, obj3])
    expect(result).toBeTruthy()

    result = _.intersects([obj1], [obj3])
    expect(result).toBeFalsy()
  })
  test('handles NaN and -0 with SameValueZero semantics', () => {
    expect(_.intersects([1, Number.NaN], [Number.NaN, 2])).toBe(true)
    expect(_.intersects([1, Number.NaN], [2, 3])).toBe(false)
    expect(_.intersects([-0], [0])).toBe(true)

    expect(
      _.intersects(
        [{ v: Number.NaN }],
        [{ v: 1 }, { v: Number.NaN }],
        x => x.v,
      ),
    ).toBe(true)
    expect(
      _.intersects([{ v: Number.NaN }], [{ v: 1 }, { v: 2 }], x => x.v),
    ).toBe(false)
    expect(_.intersects([{ v: -0 }], [{ v: 0 }], x => x.v)).toBe(true)
    expect(
      _.intersects(
        [{ v: 1 }, { v: Number.NaN }],
        [{ v: 2 }, { v: Number.NaN }],
        x => x.v,
      ),
    ).toBe(true)
  })
  test('works with large arrays with and without identity', () => {
    const listA = Array.from({ length: 100 }, (_, i) => i)
    const listBMatch = Array.from({ length: 50 }, (_, i) =>
      i === 49 ? 99 : i + 200,
    )
    const listBDisjoint = Array.from({ length: 120 }, (_, i) => i + 200)

    expect(_.intersects(listA, listBMatch)).toBe(true)
    expect(_.intersects(listBMatch, listA)).toBe(true)
    expect(_.intersects(listA, listBDisjoint)).toBe(false)
    expect(_.intersects(listBDisjoint, listA)).toBe(false)
    expect(_.intersects(listA, [99])).toBe(true)
    expect(_.intersects(listA, [999])).toBe(false)
    expect(_.intersects([99], listA)).toBe(true)
    expect(_.intersects([999], listA)).toBe(false)

    const largeWithNaN = [...listA, Number.NaN]
    const largeOtherNaN = [...listBDisjoint, Number.NaN]
    expect(_.intersects(largeWithNaN, largeOtherNaN)).toBe(true)

    const objsA = listA.map(value => ({ value }))
    const objsBMatch = listBMatch.map(value => ({ value }))
    const objsBDisjoint = listBDisjoint.map(value => ({ value }))
    expect(_.intersects(objsA, objsBMatch, x => x.value)).toBe(true)
    expect(_.intersects(objsA, objsBDisjoint, x => x.value)).toBe(false)
  })
})
