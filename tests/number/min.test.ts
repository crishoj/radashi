import * as _ from 'radashi'

describe('min', () => {
  test('returns the min value from list of number', () => {
    const list = [5, 5, 10, 2]
    const result = _.min(list)
    expect(result).toBe(2)
  })
  test('returns the min value from list of objects', () => {
    const list = [
      { game: 'a', score: 100 },
      { game: 'b', score: 200 },
      { game: 'c', score: 300 },
      { game: 'd', score: 400 },
      { game: 'e', score: 500 },
    ]
    const result = _.min(list, x => x.score)
    expect(result!.game).toBe('a')
    expect(result!.score).toBe(100)
  })
  test('returns null if array is empty', () => {
    const result = _.min([])
    expect(result).toBeNull()
  })
  test('returns single element without calling getter', () => {
    expect(_.min([42])).toBe(42)
    const item = { game: 'a', score: 100 }
    const getter = vi.fn((x: typeof item) => x.score)
    expect(_.min([item], getter)).toBe(item)
    expect(getter).not.toHaveBeenCalled()
  })
  test('returns later element on ties and calls getter once each', () => {
    const first = { game: 'a', score: 100 }
    const second = { game: 'b', score: 100 }
    const getter = vi.fn((x: typeof first) => x.score)
    expect(_.min([first, second], getter)).toBe(second)
    expect(getter).toHaveBeenCalledTimes(2)
  })
  test('handles NaN consistently with reduce comparison', () => {
    expect(_.min([5, Number.NaN])).toBeNaN()
    expect(_.min([Number.NaN, 5])).toBe(5)
    const a = { game: 'a', score: 5 }
    const b = { game: 'b', score: Number.NaN }
    expect(_.min([a, b], x => x.score)).toBe(b)
    expect(_.min([b, a], x => x.score)).toBe(a)
  })
})
