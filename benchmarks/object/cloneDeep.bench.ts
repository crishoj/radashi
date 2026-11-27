import * as _ from 'radashi'

describe('cloneDeep', () => {
  const objects: any = _.list(0, 5, i => {
    const object: any = {}
    _.set(object, 'a.b.c.d.e.f.g.h.i.k.l.m.n.o.p', i)
    return object
  })

  bench('dozens of nested plain objects', () => {
    _.cloneDeep(objects)
  })

  bench('dozens of nested plain objects (FastCloningStrategy)', () => {
    _.cloneDeep(objects, _.FastCloningStrategy)
  })

  const buildNestedTree = (depth: number): any =>
    depth === 0
      ? { value: 42, label: 'leaf', flag: true }
      : {
          left: buildNestedTree(depth - 1),
          right: buildNestedTree(depth - 1),
          meta: { depth },
        }

  const nestedTree = buildNestedTree(5)

  bench('nested plain object tree', () => {
    _.cloneDeep(nestedTree)
  })

  bench('nested plain object tree (FastCloningStrategy)', () => {
    _.cloneDeep(nestedTree, _.FastCloningStrategy)
  })

  const arrayOfObjects = _.list(0, 99, i => ({
    id: i,
    name: `item-${i}`,
    tags: ['a', 'b', 'c'],
  }))

  bench('array of 100 objects', () => {
    _.cloneDeep(arrayOfObjects)
  })

  const mapsAndSets = {
    map: new Map(_.list(0, 29, i => [i, { id: i, values: [i, i + 1] }])),
    set: new Set(_.list(0, 29, i => ({ id: i, active: i % 2 === 0 }))),
  }

  bench('Maps and Sets with nested objects', () => {
    _.cloneDeep(mapsAndSets)
  })

  const mixedBuiltins = {
    dates: _.list(0, 19, i => new Date(1700000000000 + i)),
    regexps: _.list(0, 19, i => new RegExp(`test-${i}`, 'g')),
    nested: { a: 1, b: { c: 2, d: new Date() } },
  }

  bench('object with non-cloned built-ins', () => {
    _.cloneDeep(mixedBuiltins)
  })
})
