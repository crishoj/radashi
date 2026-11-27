import * as _ from 'radashi'

describe('escapeHTML', () => {
  const htmlMarkup =
    '<div class="card" data-id=\'123\'><h1>Hello & welcome</h1>' +
    '<p>Click <a href="/docs?a=1&b=2">"here"</a> to read more.</p></div>'
  const plainText =
    'The quick brown fox jumps over the lazy dog ' +
    'without any special HTML characters to escape.'
  const sentence =
    'Tom & Jerry went to the market to buy some cheese, then they came ' +
    'back home and sat down to eat it while watching TV for hours.'
  const paragraph =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do ' +
    'eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ' +
    'ad minim veniam, quis nostrud exercitation "ullamco" & laboris. '
  const longSparse = paragraph.repeat(25)

  bench('with valid input', () => {
    _.escapeHTML('&<>"\'')
  })

  bench('with HTML markup', () => {
    _.escapeHTML(htmlMarkup)
  })

  bench('with plain text', () => {
    _.escapeHTML(plainText)
  })

  bench('with a sentence containing one special character', () => {
    _.escapeHTML(sentence)
  })

  bench('with long text containing sparse special characters', () => {
    _.escapeHTML(longSparse)
  })
})
