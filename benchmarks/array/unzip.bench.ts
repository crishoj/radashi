import * as _ from 'radashi'

const largeMatrix = Array.from({ length: 5 }, (_, row) =>
  Array.from({ length: 100 }, (_, col) => row * 100 + col),
)

const raggedArrays = [
  Array.from({ length: 20 }, (_, i) => i),
  Array.from({ length: 100 }, (_, i) => i),
  Array.from({ length: 5 }, (_, i) => i),
  Array.from({ length: 50 }, (_, i) => i),
]

describe('unzip', () => {
  bench('with non-empty arrays', () => {
    _.unzip([
      ['a', 1, true],
      ['b', 2, false],
    ])
  })

  bench('with 5 arrays x 100 items', () => {
    _.unzip(largeMatrix)
  })

  bench('with ragged arrays', () => {
    _.unzip(raggedArrays)
  })
})
