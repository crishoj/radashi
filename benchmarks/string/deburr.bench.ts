import * as _ from 'radashi'

describe('deburr', () => {
  const text = 'Ærøskøbing Crème Brûlée Straße Łódź'
  const ascii = 'The quick brown fox jumps over the lazy dog'
  const mixed =
    'In Ærøskøbing, the café serves Crème Brûlée along the main Straße ' +
    'near Łódź. Most of this text is plain ASCII with occasional déjà vu ' +
    'moments and naïve notes.'

  bench('latin text with diacritics', () => {
    _.deburr(text)
  })

  bench('plain ascii text', () => {
    _.deburr(ascii)
  })

  bench('longer mixed text', () => {
    _.deburr(mixed)
  })
})
