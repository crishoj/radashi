import * as _ from 'radashi'

const weekdays = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
] as const

const sut = _.series(weekdays)

const largeItems = Array.from({ length: 100 }, (_, i) => `item-${i}`)
const largeSut = _.series(largeItems)

describe('series', () => {
  bench('create series (5 items)', () => {
    _.series(weekdays)
  })

  bench('create series (100 items)', () => {
    _.series(largeItems)
  })

  describe('min method', () => {
    bench('min of two items', () => {
      sut.min('monday', 'tuesday')
    })
  })

  describe('max method', () => {
    bench('max of two items', () => {
      sut.max('thursday', 'tuesday')
    })
  })

  describe('first method', () => {
    bench('get first item', () => {
      sut.first()
    })
  })

  describe('last method', () => {
    bench('get last item', () => {
      sut.last()
    })
  })

  describe('next method', () => {
    bench('get next item', () => {
      sut.next('wednesday')
    })
  })

  describe('previous method', () => {
    bench('get previous item', () => {
      sut.previous('wednesday')
    })
  })

  describe('spin method', () => {
    bench('spin by zero', () => {
      sut.spin('wednesday', 0)
    })

    bench('spin by positive number', () => {
      sut.spin('wednesday', 3)
    })

    bench('spin by negative number', () => {
      sut.spin('wednesday', -3)
    })

    bench('spin large series by 50', () => {
      largeSut.spin('item-25', 50)
    })

    bench('spin large series by -50', () => {
      largeSut.spin('item-25', -50)
    })
  })
})
