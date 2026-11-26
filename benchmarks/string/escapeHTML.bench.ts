import * as _ from 'radashi'

describe('escapeHTML', () => {
  const htmlMarkup =
    '<div class="card" data-id=\'123\'><h1>Hello & welcome</h1>' +
    '<p>Click <a href="/docs?a=1&b=2">"here"</a> to read more.</p></div>'
  const plainText =
    'The quick brown fox jumps over the lazy dog ' +
    'without any special HTML characters to escape.'

  bench('with valid input', () => {
    _.escapeHTML('&<>"\'')
  })

  bench('with HTML markup', () => {
    _.escapeHTML(htmlMarkup)
  })

  bench('with plain text', () => {
    _.escapeHTML(plainText)
  })
})
