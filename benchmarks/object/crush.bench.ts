import * as _ from 'radashi'

describe('crush', () => {
  bench('with valid input', () => {
    const now = new Date()
    const ra = {
      name: 'ra',
      power: 100,
      friend: {
        name: 'loki',
        power: 80,
      },
      enemies: [
        {
          name: 'hathor',
          power: 12,
        },
      ],
      timestamp: now,
    }
    _.crush(ra)
  })

  const largeNested = {
    meta: {
      version: 2,
      generatedAt: new Date(),
      flags: { strict: true, verbose: false, retries: 3 },
    },
    users: Array.from({ length: 20 }, (_, i) => ({
      id: i,
      name: `user-${i}`,
      active: i % 2 === 0,
      profile: {
        email: `user${i}@example.com`,
        address: {
          city: 'Cairo',
          zip: 10000 + i,
        },
      },
      scores: [i, i * 2, i * 3],
      emptyObj: {},
      emptyArr: [],
    })),
  }

  bench('large nested object and arrays', () => {
    _.crush(largeNested)
  })
})
