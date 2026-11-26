import * as _ from 'radashi'

test('escapeHTML', () => {
  expect(_.escapeHTML('&<>"\'')).toMatchInlineSnapshot(
    `"&amp;&lt;&gt;&quot;&#39;"`,
  )
  expect(_.escapeHTML('<div>Hello, world!</div>')).toBe(
    '&lt;div&gt;Hello, world!&lt;/div&gt;',
  )
  expect(_.escapeHTML('Hello & world')).toBe('Hello &amp; world')
  expect(_.escapeHTML('Hello, world!')).toBe('Hello, world!')
  expect(_.escapeHTML('')).toBe('')
})
