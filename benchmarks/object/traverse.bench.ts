import * as _ from 'radashi'

describe('traverse', () => {
  const root = {
    a: { b: { c: { d: { e: 1 } } } },
  }
  bench('basic traversal', () => {
    _.traverse(root, () => {})
  })

  const arrayTree = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    tags: ['a', 'b', 'c', 'd'],
    values: [i, i + 1, i + 2, [i + 3, i + 4]],
  }))
  bench('array-heavy tree', () => {
    _.traverse(arrayTree, () => {})
  })

  const buildObjectTree = (depth: number, breadth: number): object => {
    const obj: Record<string, unknown> = {}
    for (let i = 0; i < breadth; i++) {
      obj[`k${i}`] = depth > 1 ? buildObjectTree(depth - 1, breadth) : i
    }
    return obj
  }
  const largeObject = buildObjectTree(4, 4)
  bench('large nested object', () => {
    _.traverse(largeObject, () => {})
  })
})
