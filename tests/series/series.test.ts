import * as _ from 'radashi'

describe('series', () => {
  const sut = _.series([
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
  ] as const)

  describe('min method', () => {
    test('correctly returns min', () => {
      const result = sut.min('monday', 'tuesday')
      expect(result).toBe('monday')
    })
    test('correctly returns min when second arg', () => {
      const result = sut.min('tuesday', 'monday')
      expect(result).toBe('monday')
    })
  })

  describe('max method', () => {
    test('correctly returns max', () => {
      const result = sut.max('thursday', 'tuesday')
      expect(result).toBe('thursday')
    })
    test('correctly returns max when second arg', () => {
      const result = sut.max('tuesday', 'thursday')
      expect(result).toBe('thursday')
    })
  })

  describe('first method', () => {
    test('returns first item', () => {
      const result = sut.first()
      expect(result).toBe('monday')
    })
  })

  describe('last method', () => {
    test('returns last item', () => {
      const result = sut.last()
      expect(result).toBe('friday')
    })
  })

  describe('next method', () => {
    test('returns next item', () => {
      const result = sut.next('wednesday')
      expect(result).toBe('thursday')
    })
    test('returns first given last exhausted', () => {
      const result = sut.next('friday')
      expect(result).toBe('monday')
    })
    test('returns the given default when the last is exhausted', () => {
      const result = sut.next('friday', 'wednesday')
      expect(result).toBe('wednesday')
    })
  })

  describe('previous method', () => {
    test('returns previous item', () => {
      const result = sut.previous('wednesday')
      expect(result).toBe('tuesday')
    })
    test('returns last given first exhausted', () => {
      const result = sut.previous('monday')
      expect(result).toBe('friday')
    })
    test('returns the given default when the first is exhausted', () => {
      const result = sut.previous('monday', 'wednesday')
      expect(result).toBe('wednesday')
    })
  })

  describe('spin method', () => {
    test('returns current given zero', () => {
      const result = sut.spin('wednesday', 0)
      expect(result).toBe('wednesday')
    })
    test('returns friday given -3 starting at wednesday', () => {
      const result = sut.spin('wednesday', -3)
      expect(result).toBe('friday')
    })
    test('returns monday given 3 starting at wednesday', () => {
      const result = sut.spin('wednesday', 3)
      expect(result).toBe('monday')
    })
    test('returns monday given 13 starting at wednesday', () => {
      const result = sut.spin('wednesday', 13)
      expect(result).toBe('monday')
    })
    test('returns friday given -13 starting at wednesday', () => {
      const result = sut.spin('wednesday', -13)
      expect(result).toBe('friday')
    })
    test('returns monday given -2 starting at wednesday', () => {
      expect(sut.spin('wednesday', -2)).toBe('monday')
      expect(sut.spin('wednesday', -7)).toBe('monday')
    })
    test('returns same item given multiples of length', () => {
      expect(sut.spin('wednesday', 5)).toBe('wednesday')
      expect(sut.spin('wednesday', -5)).toBe('wednesday')
      expect(sut.spin('wednesday', 10)).toBe('wednesday')
      expect(sut.spin('wednesday', -10)).toBe('wednesday')
    })
    test('handles current item not in series', () => {
      const unknown = 'sunday' as unknown as 'monday'
      expect(sut.spin(unknown, 1)).toBe('monday')
      expect(sut.spin(unknown, 3)).toBe('wednesday')
      expect(sut.spin(unknown, 5)).toBe('friday')
      expect(sut.spin(unknown, 6)).toBe('monday')
      expect(sut.spin(unknown, 10)).toBe(unknown)
      expect(sut.spin(unknown, -1)).toBe('friday')
      expect(sut.spin(unknown, -3)).toBe('wednesday')
      expect(sut.spin(unknown, -5)).toBe('monday')
      expect(sut.spin(unknown, -6)).toBe('friday')
      expect(sut.spin(unknown, -10)).toBe(unknown)
    })
    test('returns current for non-finite and fractional numbers', () => {
      expect(sut.spin('wednesday', Number.NaN)).toBe('wednesday')
      expect(sut.spin('wednesday', Number.POSITIVE_INFINITY)).toBe('wednesday')
      expect(sut.spin('wednesday', Number.NEGATIVE_INFINITY)).toBe('wednesday')
      expect(sut.spin('wednesday', 0.5)).toBe('wednesday')
      expect(sut.spin('wednesday', -0.5)).toBe('wednesday')
      expect(sut.spin('wednesday', 1.5)).toBe('thursday')
      expect(sut.spin('wednesday', -1.5)).toBe('tuesday')
    })
    test('handles Object.prototype keys when absent from series', () => {
      const protoKey = 'toString' as unknown as 'monday'
      expect(sut.spin(protoKey, 1)).toBe('monday')
      expect(sut.spin(protoKey, -1)).toBe('friday')
      expect(sut.spin(protoKey, 10)).toBe(protoKey)
      expect(sut.next(protoKey)).toBe('monday')
      expect(sut.previous(protoKey)).toBe('friday')
    })
    test('returns current for empty series', () => {
      const empty = _.series<string>([])
      expect(empty.spin('monday', 3)).toBe('monday')
      expect(empty.spin('monday', -3)).toBe('monday')
      expect(empty.first()).toBeUndefined()
      expect(empty.last()).toBeUndefined()
    })
  })

  describe('custom toKey', () => {
    test('supports custom key extractor', () => {
      const items = [
        { id: 'a', value: 1 },
        { id: 'b', value: 2 },
        { id: 'c', value: 3 },
      ]
      const custom = _.series(items, item => item.id)
      expect(custom.next(items[0])).toBe(items[1])
      expect(custom.previous(items[0])).toBe(items[2])
      expect(custom.spin(items[0], 2)).toBe(items[2])
      expect(custom.spin(items[0], -1)).toBe(items[2])
    })
  })

  describe('immutability', () => {
    test('snapshots input items on creation', () => {
      const items = ['a', 'b', 'c']
      const s = _.series(items)
      items.push('d')
      items[0] = 'z'
      expect(s.first()).toBe('a')
      expect(s.last()).toBe('c')
      expect(s.spin('a', 2)).toBe('c')
    })
  })
})
