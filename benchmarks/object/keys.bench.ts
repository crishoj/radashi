import * as _ from 'radashi'

describe('keys', () => {
  bench('with empty object', () => {
    _.keys({})
  })

  bench('with non-empty object', () => {
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
    }
    _.keys(ra)
  })

  const largeTree = {
    id: 1,
    meta: {
      createdAt: new Date(0),
      tags: ['a', 'b', 'c', 'd', 'e'],
      flags: {
        active: true,
        verified: false,
        tier: 3,
      },
    },
    users: Array.from({ length: 10 }, (_, i) => ({
      id: i,
      name: `user-${i}`,
      profile: {
        email: `user${i}@example.com`,
        role: i % 2 === 0 ? 'admin' : 'member',
        scores: [i * 10, i * 20, i * 30],
      },
      settings: {
        theme: 'dark',
        notifications: {
          email: true,
          sms: false,
        },
      },
    })),
  }

  bench('with large nested tree', () => {
    _.keys(largeTree)
  })
})
