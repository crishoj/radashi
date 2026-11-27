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
  test('returns the only element of a single-element array', () => {
    expect(_.max([42])).toBe(42)
    const item = { game: 'a', score: 100 }
    expect(_.max([item], x => x.score)).toBe(item)
  })
  test('returns later element on ties', () => {
    const first = { game: 'a', score: 100 }
    const second = { game: 'b', score: 100 }
    expect(_.max([first, second], x => x.score)).toBe(second)
  })
  test('calls getter once per element', () => {
    const list = [{ score: 2 }, { score: 1 }, { score: 3 }, { score: 2 }]
    const getter = vi.fn((x: { score: number }) => x.score)
    _.max(list, getter)
    expect(getter).toHaveBeenCalledTimes(list.length)
  })
  test('skips holes in sparse arrays', () => {
    const a = { score: 1 }
    const b = { score: 3 }
    // biome-ignore lint/suspicious/noSparseArray: testing sparse arrays
    expect(_.max([, a, , b] as (typeof a)[], x => x.score)).toBe(b)
    // biome-ignore lint/suspicious/noSparseArray: testing sparse arrays
    expect(_.max([, 1, , 3] as number[])).toBe(3)
    // biome-ignore lint/suspicious/noSparseArray: testing sparse arrays
    expect(_.max([, ,] as number[])).toBeNull()
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
