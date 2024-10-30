import * as _ from 'radashi'

describe('pluck', () => {
  const countries = [
    { name: 'Japan', capital: 'Tokyo' },
    { name: 'Indonesia', capital: 'Jakarta' },
    { name: 'Bhutan', capital: 'Thimphu' },
  ]
  test('returns empty array for empty input array', () => {
    const result = _.pluck([], 'name')
    expect(result).toEqual([])
  })
  test('returns array with property values', () => {
    const result = _.pluck(countries, 'capital')
    expect(result).toEqual(['Tokyo', 'Jakarta', 'Thimphu'])
  })
})
