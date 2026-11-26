import * as _ from 'radashi'

describe('max', () => {
  test('returns the max value from list of number', () => {
    const list = [5, 5, 10, 2]
    const result = _.max(list)
    expect(result).toBe(10)
  })
  test('returns the max value from list of objects', () => {
    const list = [
      { game: 'a', score: 100 },
      { game: 'b', score: 200 },
      { game: 'c', score: 300 },
      { game: 'd', score: 400 },
      { game: 'e', score: 500 },
    ]
    const result = _.max(list, x => x.score)
    expect(result!.game).toBe('e')
    expect(result!.score).toBe(500)
  })
  test('returns null if array is empty', () => {
    const result = _.max([])
    expect(result).toBeNull()
  })
  test('returns single element without calling getter', () => {
    expect(_.max([42])).toBe(42)
    const item = { game: 'a', score: 100 }
    const getter = vi.fn((x: typeof item) => x.score)
    expect(_.max([item], getter)).toBe(item)
    expect(getter).not.toHaveBeenCalled()
  })
  test('returns later element on ties and calls getter once each', () => {
    const first = { game: 'a', score: 100 }
    const second = { game: 'b', score: 100 }
    const getter = vi.fn((x: typeof first) => x.score)
    expect(_.max([first, second], getter)).toBe(second)
    expect(getter).toHaveBeenCalledTimes(2)
  })
  test('handles NaN consistently with reduce comparison', () => {
    expect(_.max([5, Number.NaN])).toBeNaN()
    expect(_.max([Number.NaN, 5])).toBe(5)
    const a = { game: 'a', score: 5 }
    const b = { game: 'b', score: Number.NaN }
    expect(_.max([a, b], x => x.score)).toBe(b)
    expect(_.max([b, a], x => x.score)).toBe(a)
  })
})
