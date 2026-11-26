import * as _ from 'radashi'

describe('min', () => {
  bench('with list of numbers', () => {
    const list = [5, 5, 10, 2]
    _.min(list)
  })

  bench('with list of objects', () => {
    const list = [
      { game: 'a', score: 100 },
      { game: 'b', score: 200 },
      { game: 'c', score: 300 },
      { game: 'd', score: 400 },
      { game: 'e', score: 500 },
    ]
    _.min(list, x => x.score)
  })

  const largeNumbers = Array.from(
    { length: 1000 },
    (_, i) => (i * 2654435761) % 1000,
  )
  const largeObjects = largeNumbers.map((score, id) => ({ id, score }))
  const getScore = (x: { score: number }) => x.score

  bench('with 1,000 numbers', () => {
    _.min(largeNumbers)
  })

  bench('with 1,000 objects', () => {
    _.min(largeObjects, getScore)
  })
})
