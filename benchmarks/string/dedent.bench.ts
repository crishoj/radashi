import * as _ from 'radashi'

describe('dedent', () => {
  const input = `
    Hello
    World
  `

  const largeInput =
    '\n' +
    Array.from(
      { length: 40 },
      (_, i) => `        line ${i}: const value = ${i * 2}`,
    ).join('\n') +
    '\n    '

  bench('dedent as tagged template literal', () => {
    _.dedent`
      Hello
      World
      ${[1, 2, 3].join('\n')}
    `
  })

  bench('dedent as direct call', () => {
    _.dedent(input)
  })

  bench('dedent large multiline block', () => {
    _.dedent(largeInput)
  })
})
