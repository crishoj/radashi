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
  test('returns true using custom identity', () => {
    const listA = [{ value: 23 }, { value: 12 }]
    const listB = [{ value: 12 }]
    const result = _.intersects(listA, listB, x => x.value)
    expect(result).toBeTruthy()
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
  test('works with large lists', () => {
    const listA = Array.from({ length: 50 }, (_, i) => i)
    const listB = Array.from({ length: 50 }, (_, i) => i + 50)
    expect(_.intersects(listA, listB)).toBe(false)
    expect(_.intersects(listA, [...listB, 25])).toBe(true)
    // Same SameValueZero semantics as `includes`
    expect(_.intersects([...listA, Number.NaN], [...listB, Number.NaN])).toBe(
      true,
    )
    expect(_.intersects([...listB, -0], [...listB.map(x => -x), 0])).toBe(true)
  })
  test('treats holes like the native array methods do', () => {
    // Append a hole to a copy of the given array.
    const withHole = <T>(array: T[]) => {
      const copy = array.slice()
      copy.length++
      return copy
    }
    // `some` skips holes in listB, while `includes` and `new Set` see
    // holes in listA as `undefined`.
    expect(_.intersects([undefined], withHole([1]))).toBe(false)
    expect(_.intersects(withHole([1]), [undefined])).toBe(true)
    // `map` skips holes, so `identity` is never called with one.
    expect(_.intersects(withHole([{ v: 1 }]), [{ v: 1 }], x => x.v)).toBe(true)

    const listA = Array.from({ length: 40 }, (_, i) => i + 1)
    const listB = listA.map(x => -x)
    expect(_.intersects([...listA, undefined], withHole(listB))).toBe(false)
    expect(_.intersects(withHole(listA), [...listB, undefined])).toBe(true)
  })
})
