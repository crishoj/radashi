import * as _ from 'radashi'

const mediumLists = Array.from({ length: 100 }, (_, i) =>
  Array.from({ length: 10 }, (_, j) => i * 10 + j),
)

const largeLists = Array.from({ length: 10 }, (_, i) =>
  Array.from({ length: 1000 }, (_, j) => i * 1000 + j),
)

describe('flat', () => {
  bench('with non-empty input list', () => {
    const lists = [['a', 'b'], ['c', 'd'], ['e']]
    _.flat(lists)
  })

  bench('100 arrays of 10 items', () => {
    _.flat(mediumLists)
  })

  bench('10 arrays of 1,000 items', () => {
    _.flat(largeLists)
  })
})
