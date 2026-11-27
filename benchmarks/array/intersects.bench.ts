import * as _ from 'radashi'

const largeListA = Array.from({ length: 200 }, (_, i) => i)
const largeListBIntersecting = Array.from({ length: 200 }, (_, i) =>
  i === 199 ? 199 : i + 200,
)
const largeListBDisjoint = Array.from({ length: 200 }, (_, i) => i + 200)

const largeObjectsA = Array.from({ length: 200 }, (_, i) => ({ value: i }))
const largeObjectsBIntersecting = Array.from({ length: 200 }, (_, i) => ({
  value: i === 199 ? 199 : i + 200,
}))
const largeObjectsBDisjoint = Array.from({ length: 200 }, (_, i) => ({
  value: i + 200,
}))
const getValue = (item: { value: number }) => item.value

describe('intersects', () => {
  bench('with mixed arrays', () => {
    const listA = ['a', 'b']
    const listB = [1, 2, 'b', 'x']
    _.intersects(listA, listB)
  })

  bench('with no common items', () => {
    const listA = ['a', 'b', 'c']
    const listB = ['x', 'y']
    _.intersects(listA, listB)
  })

  bench('with custom identity function', () => {
    const listA = [{ value: 23 }, { value: 12 }]
    const listB = [{ value: 12 }]
    _.intersects(listA, listB, x => x.value)
  })

  bench('with object arrays', () => {
    const obj1 = { id: 1 }
    const obj2 = { id: 2 }
    const obj3 = { id: 3 }

    _.intersects([obj1, obj2], [obj2, obj3])
    _.intersects([obj1], [obj3])
  })

  bench('with 200 elements (intersecting)', () => {
    _.intersects(largeListA, largeListBIntersecting)
  })

  bench('with 200 elements (disjoint)', () => {
    _.intersects(largeListA, largeListBDisjoint)
  })

  bench('with 200 elements and custom identity (intersecting)', () => {
    _.intersects(largeObjectsA, largeObjectsBIntersecting, getValue)
  })

  bench('with 200 elements and custom identity (disjoint)', () => {
    _.intersects(largeObjectsA, largeObjectsBDisjoint, getValue)
  })
})
