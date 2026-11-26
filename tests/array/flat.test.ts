import * as _ from 'radashi'

describe('flat', () => {
  test('returns all items in all arrays', () => {
    const lists = [['a', 'b'], ['c', 'd'], ['e']]
    const result = _.flat(lists)
    expect(result).toEqual(['a', 'b', 'c', 'd', 'e'])
    expect(result[0]).toBe('a')
    expect(result[4]).toBe('e')
  })

  test('handles empty outer and inner arrays', () => {
    expect(_.flat([])).toEqual([])
    expect(_.flat([[], []])).toEqual([])
    expect(_.flat([[], ['a'], [], ['b', 'c'], []])).toEqual(['a', 'b', 'c'])
  })

  test('flattens only one level', () => {
    const result = _.flat([[1, 2], [[3], 4], [5]])
    expect(result).toEqual([1, 2, [3], 4, 5])
  })

  test('fills sparse array holes with undefined', () => {
    const sparse: (number | undefined)[] = new Array(3)
    sparse[0] = 1
    sparse[2] = 3
    const result = _.flat([sparse])
    expect(result).toEqual([1, undefined, 3])
    expect(1 in result).toBe(true)
  })

  test('handles large inner arrays without stack overflow', () => {
    const large = Array.from({ length: 200_000 }, (_, i) => i)
    const result = _.flat([large, [200_000]])
    expect(result.length).toBe(200_001)
    expect(result[0]).toBe(0)
    expect(result[199_999]).toBe(199_999)
    expect(result[200_000]).toBe(200_000)
  })
})
