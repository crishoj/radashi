import * as _ from 'radashi'

describe('deburr', () => {
  test('removes accent marks and ligatures from latin text', () => {
    const cases: [string, string][] = [
      ['déjà vu', 'deja vu'],
      ['Crème Brûlée', 'Creme Brulee'],
      ['Straße', 'Strasse'],
      ['Ærøskøbing', 'Aeroskobing'],
      ['Łódź', 'Lodz'],
      ['a\uFE20b\uFE23c', 'abc'],
      [
        // cspell:disable-next-line
        'ÆÐØÞßæðøþĐđĦħıĲĳĸĿŀŁłŉŊŋŒœŦŧſ',
        // cspell:disable-next-line
        "AeDOThssaedothDdHhiIJijkLlLl'nNnOeoeTts",
      ],
    ]

    for (const [input, expected] of cases) {
      expect(_.deburr(input)).toBe(expected)
    }
  })

  test('returns plain ascii and unmapped non-ascii text unchanged', () => {
    const cases = [
      '',
      'The quick brown fox jumps over the lazy dog',
      '© 2026 — £100',
      '2 × 3 ÷ 4',
      'ƒ(x)',
      'こんにちは世界 🚀 ！',
    ]

    for (const input of cases) {
      expect(_.deburr(input)).toBe(input)
    }
  })
})
