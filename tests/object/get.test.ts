import * as _ from 'radashi'

describe('get', () => {
  type Person = {
    name: string
    age: number
    friends?: Person[]
  }
  const jay: Person = {
    name: 'jay',
    age: 17,
    friends: [
      {
        name: 'carl',
        age: 17,
        friends: [
          {
            name: 'sara',
            age: 17,
          },
        ],
      },
    ],
  }
  test('handles null and undefined input', () => {
    expect(_.get(null, 'name')).toBeUndefined()
    expect(_.get(undefined, 'name')).toBeUndefined()
  })
  test('respects undefined as default value', () => {
    expect(_.get({}, 'a.b.c', undefined)).toBeUndefined()
  })
  test('returns specified value or default using path', () => {
    expect(_.get({ age: undefined }, 'age', 22)).toBe(22)
    expect(_.get(jay, 'friends[0].age')).toBe(17)
    expect(_.get(jay, 'friends["0"].age')).toBe(17)
    expect(_.get(jay, 'friends.0.age')).toBe(17)
    expect(_.get(jay, 'friends.1.age')).toBeUndefined()
    expect(_.get(jay, 'friends.0.friends[0].name')).toBe('sara')
    expect(_.get(jay, 'name')).toBe('jay')
    expect(_.get(jay, '[name]')).toBe('jay')
    expect(_.get(jay, '["name"]')).toBe('jay')
    expect(_.get(jay, 'friends[0][name]')).toBe('carl')
    expect(_.get(jay, 'friends[0].friends[0].friends[0].age', 22)).toBe(22)
  })
  test('handles edge-case paths and values', () => {
    expect(_.get(null, '', 'default')).toBe('default')
    expect(_.get(undefined, '', 'default')).toBe('default')
    expect(_.get({ a: 1 }, '')).toEqual({ a: 1 })
    expect(_.get({ a: 1 }, '   \t\n  ')).toEqual({ a: 1 })
    expect(_.get({ a: 1 }, '""')).toEqual({ a: 1 })
    expect(_.get({ a: 1 }, "''")).toEqual({ a: 1 })
    expect(_.get({ a: 1 }, 'a..')).toBe(1)
    expect(_.get({ a: null }, 'a', 'default')).toBeNull()
    expect(_.get({ a: null }, 'a.', 'default')).toBe('default')
    expect(_.get({ a: null }, '[a]', 'default')).toBe('default')
    expect(_.get({ a: { b: null } }, 'a.b', 'default')).toBeNull()
    expect(_.get({ a: { b: null } }, 'a.b.', 'default')).toBe('default')
    expect(_.get({ a: { b: 1 } }, 'a..b')).toBe(1)
    expect(_.get({ a: 0, b: false, c: '' }, 'a', 1)).toBe(0)
    expect(_.get({ a: 0, b: false, c: '' }, 'b', true)).toBe(false)
    expect(_.get({ a: 0, b: false, c: '' }, 'c', 'x')).toBe('')
  })
  test('handles quoted, whitespace, numeric, and non-ASCII keys', () => {
    expect(_.get({ ' a ': 1 }, ' a ')).toBe(1)
    expect(_.get({ ' a ': 1 }, '[" a "]')).toBe(1)
    expect(_.get({ ' a ': 1 }, "[' a ']")).toBe(1)
    expect(_.get({ a: { ' b ': 2 } }, 'a." b "')).toBe(2)
    expect(_.get({ ab: 3 }, "a'b")).toBe(3)
    expect(_.get({ ab: 4 }, 'a"b"')).toBe(4)
    expect(_.get({ ab: 5 }, '"a""b"')).toBe(5)
    expect(_.get({ ab: 6 }, "'a\"b'")).toBe(6)
    expect(_.get({ a: { ab: 7 } }, "a.a'b")).toBe(7)
    expect(_.get({ a: { b: 8 } }, '["a"].["b"]')).toBe(8)
    expect(_.get({ a: { b: 9 } }, 'a."b"')).toBe(9)
    expect(_.get({ a: { b: 10 } }, "a.'b'")).toBe(10)
    expect(_.get({ '01': 'leading-zero' }, '01')).toBe('leading-zero')
    expect(_.get({ '00': 'double-zero' }, '00')).toBe('double-zero')
    expect(_.get({ 12: 'twelve' }, '12')).toBe('twelve')
    expect(_.get({ 1234567890: 'ten-digits' }, '1234567890')).toBe('ten-digits')
    expect(_.get({ 12: { a: 'nested-num' } }, '12.a')).toBe('nested-num')
    expect(_.get([0, 1, 2], '2')).toBe(2)
    expect(_.get([null], '0.a', 'default')).toBe('default')
    expect(_.get({ '\0': 'nul' }, '\0')).toBe('nul')
    expect(_.get({ A: { 1: 'upper' } }, 'A.1')).toBe('upper')
    expect(_.get({ café: { é: 'accent' } }, 'café.é')).toBe('accent')
    expect(_.get({ é: { a: 'hi' } }, 'é.a')).toBe('hi')
    expect(_.get({ a: 1 }, '\u00A0')).toEqual({ a: 1 })
    expect(_.get({ a: { b: 2 } }, 'a.\u00A0.b')).toBe(2)
  })
})
