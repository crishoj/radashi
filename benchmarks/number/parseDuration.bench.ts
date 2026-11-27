import * as _ from 'radashi'

describe('parseDuration', () => {
  bench('with default units', () => {
    _.parseDuration('5 minutes')
    _.parseDuration('250ms')
    _.parseDuration('2.5 hours')
  })

  bench('with custom options', () => {
    _.parseDuration('2 months', {
      units: {
        month: 30 * 86_400_000,
      },
      short: {
        mo: 'month',
      },
    })
  })
})
