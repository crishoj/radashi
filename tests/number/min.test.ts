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
  test('returns the only element of a single-element array', () => {
    expect(_.min([42])).toBe(42)
    const item = { game: 'a', score: 100 }
    expect(_.min([item], x => x.score)).toBe(item)
  })
  test('returns later element on ties', () => {
    const first = { game: 'a', score: 100 }
    const second = { game: 'b', score: 100 }
    expect(_.min([first, second], x => x.score)).toBe(second)
  })
  test('calls getter once per element', () => {
    const list = [{ score: 2 }, { score: 1 }, { score: 3 }, { score: 2 }]
    const getter = vi.fn((x: { score: number }) => x.score)
    _.min(list, getter)
    expect(getter).toHaveBeenCalledTimes(list.length)
  })
  test('skips holes in sparse arrays', () => {
    const a = { score: 3 }
    const b = { score: 1 }
    // biome-ignore lint/suspicious/noSparseArray: testing sparse arrays
    expect(_.min([, a, , b] as (typeof a)[], x => x.score)).toBe(b)
    // biome-ignore lint/suspicious/noSparseArray: testing sparse arrays
    expect(_.min([, 3, , 1] as number[])).toBe(1)
    expect(_.min(new Array<number>(2))).toBeNull()
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
