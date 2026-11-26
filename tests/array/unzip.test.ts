import * as _ from 'radashi'

describe('unzip', () => {
  test('unzips an array correctly', () => {
    const result = _.unzip([
      ['a', 1, true],
      ['b', 2, false],
    ])
    expect(result).toEqual([
      ['a', 'b'],
      [1, 2],
      [true, false],
    ])
  })

  test('returns an empty array for empty input', () => {
    expect(_.unzip([])).toEqual([])
    expect(_.unzip([[], []])).toEqual([])
  })

  test('unzips arrays with differing lengths', () => {
    const result = _.unzip<string | number>([
      ['a', 'b', 'c'],
      [1, 2],
    ])
    expect(result).toEqual([
      ['a', 1],
      ['b', 2],
      ['c', undefined],
    ])
  })
})
