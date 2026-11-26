import * as _ from 'radashi'

describe('construct', () => {
  test('returns correctly constructed object', () => {
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
        {
          name: 'vishnu',
          power: 58,
        },
      ],
      timestamp: now,
      arr: [],
      empty: {},
      und: undefined,
    }
    expect(
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
        arr: [],
        empty: {},
        und: undefined,
      }),
    ).toEqual(ra)
  })

  test('ignores empty and delimiter-only paths', () => {
    expect(_.construct({})).toStrictEqual({})
    expect(_.construct({ '': 'ignored', a: 1 })).toStrictEqual({ a: 1 })
    expect(
      _.construct({ '.': 'ignored', '[]': 'ignored', a: 1 }),
    ).toStrictEqual({ a: 1 })
  })

  test('handles bracket notation and sparse arrays', () => {
    expect(
      _.construct({
        'cards[0].value': 2,
        'cards.[1].[0].name': 'ace',
        'sparse.2.value': 'ok',
        '[root]': 'top',
      }),
    ).toStrictEqual({
      cards: [{ value: 2 }, [{ name: 'ace' }]],
      // biome-ignore lint/suspicious/noSparseArray:
      sparse: [, , { value: 'ok' }],
      root: 'top',
    })
  })

  test('matches set semantics for undefined values', () => {
    const flat = _.construct({ foo: undefined })
    expect(flat).toStrictEqual({})
    expect('foo' in flat).toBe(false)

    const nested = _.construct({ 'a.b': undefined, 'c.0': undefined })
    expect(nested).toStrictEqual({ a: {}, c: [] })

    const overwritten = _.construct({ 'a.b': 1, 'a[b]': undefined })
    expect(overwritten).toStrictEqual({ a: { b: undefined } })
  })

  test('handles null intermediates', () => {
    expect(_.construct({ a: null, 'a.b': 1 })).toStrictEqual({ a: { b: 1 } })
    expect(_.construct({ a: null, 'a.b': undefined })).toStrictEqual({ a: {} })
  })

  test('replaces conflicting primitive intermediates when changed', () => {
    expect(_.construct({ a: 'str', 'a.b': 1 })).toStrictEqual({ a: { b: 1 } })
    expect(_.construct({ a: 5, 'a[0].b': 1 })).toStrictEqual({
      a: [{ b: 1 }],
    })
    expect(_.construct({ a: 'str', 'a.length': undefined })).toStrictEqual({
      a: { length: undefined },
    })
    expect(_.construct({ a: 'str', 'a.0': undefined })).toStrictEqual({
      a: [undefined],
    })
    expect(_.construct({ a: 'str', 'a.length.x': 1 })).toStrictEqual({
      a: { length: { x: 1 } },
    })
    expect(_.construct({ a: 'str', 'a.b.c': undefined })).toStrictEqual({
      a: { b: {} },
    })
    expect(
      _.construct({ 'b.0': 1, 'b.1': true, 'b[1].a': 17 }),
    ).toStrictEqual({
      b: [1, { a: 17 }],
    })
    expect(_.construct({ a: 'str', 'a.0': 1, 'a.1': 2 })).toStrictEqual({
      a: [1, 2],
    })
  })

  test('retains conflicting primitive intermediates when unchanged', () => {
    expect(_.construct({ a: 'str', 'a.b': undefined })).toStrictEqual({
      a: 'str',
    })
    expect(_.construct({ a: 'str', 'a.length': 3 })).toStrictEqual({
      a: 'str',
    })
    expect(_.construct({ a: 'str', 'a.length.x': undefined })).toStrictEqual({
      a: 'str',
    })
    expect(_.construct({ a: 'str', 'a[0]': 's' })).toStrictEqual({ a: 'str' })
  })

  test('does not mutate input object values and preserves functions', () => {
    const inner = { c: { d: 1 } }
    const shared = { x: 1 }
    const fn = () => 1
    const output = _.construct({
      a: inner,
      b: fn,
      s: shared,
      'a.x': 2,
      'a.c.e': 3,
      'b.x': undefined,
      's.x': 1,
    }) as any

    expect(output.a).toStrictEqual({ c: { d: 1, e: 3 }, x: 2 })
    expect(inner).toStrictEqual({ c: { d: 1 } })
    expect(output.b).toBe(fn)
    expect(output.s).toBe(shared)
  })

  test.each(['__proto__', 'prototype', 'constructor'])(
    'throws on dangerous key (%s)',
    key => {
      expect(() => _.construct({ [key]: true })).toThrowError(
        `Unsafe key in path: ${key}`,
      )
      expect(() => _.construct({ [`${key}.polluted`]: true })).toThrowError(
        `Unsafe key in path: ${key}`,
      )
      expect(() => _.construct({ [`a.${key}.polluted`]: true })).toThrowError(
        `Unsafe key in path: ${key}`,
      )
      expect(() =>
        _.construct({ a: 5, [`a.${key}.polluted`]: true }),
      ).toThrowError(`Unsafe key in path: ${key}`)
    },
  )

  test('allows dangerous keys on null-prototype intermediates', () => {
    const nullProto = Object.create(null)
    const output = _.construct({
      a: nullProto,
      'a.__proto__.polluted': true,
    }) as any
    expect(Object.getPrototypeOf(output.a)).toBe(null)
    expect(output.a.__proto__).toStrictEqual({ polluted: true })
    expect(nullProto.__proto__).toBeUndefined()
  })

  test('reconstructs a large crushed object accurately', () => {
    const source = {
      items: Array.from({ length: 25 }, (_, i) => ({
        id: i,
        name: `item-${i}`,
        meta: {
          active: i % 2 === 0,
          score: i * 10,
        },
      })),
    }
    const crushed = _.crush(source)
    expect(_.construct(crushed)).toStrictEqual(source)
  })
})
