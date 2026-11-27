import * as _ from 'radashi'

const largeNested: Record<string, unknown> = {}
for (let i = 0; i < 20; i++) {
  largeNested[`items.${i}.id`] = i
  largeNested[`items.${i}.name`] = `item-${i}`
  largeNested[`items.${i}.meta.active`] = i % 2 === 0
  largeNested[`items.${i}.meta.score`] = i * 10
  largeNested[`items.${i}.meta.tag`] = `tag-${i}`
}

const largeFlat: Record<string, unknown> = {}
for (let i = 0; i < 100; i++) {
  largeFlat[`key${i}`] = i
}

describe('construct', () => {
  bench('with valid input', () => {
    const now = new Date()
    _.construct({
      name: 'ra',
      power: 100,
      'friend.name': 'loki',
      'friend.power': 80,
      'enemies.0.name': 'hathor',
      'enemies.0.power': 12,
      'enemies.1.name': 'vishnu',
      'enemies.1.power': 58,
      timestamp: now,
    })
  })

  bench('with 100 nested keys', () => {
    _.construct(largeNested)
  })

  bench('with 100 flat keys', () => {
    _.construct(largeFlat)
  })
})
