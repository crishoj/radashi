import * as _ from 'radashi'

describe('trim', () => {
  test('returns input string correctly trimmed', () => {
    expect(_.trim('\n\n\t\nhello\n\t  \n', '\n\t ')).toBe('hello')
    expect(_.trim('hello', 'x')).toBe('hello')
    expect(_.trim(' hello  ', ' ')).toBe('hello')
    expect(_.trim(' __hello__  ', '_')).toBe(' __hello__  ')
    expect(_.trim('__hello__', '_')).toBe('hello')
    expect(_.trim('//repos////', '/')).toBe('repos')
    expect(_.trim('/repos/:owner/:repo/', '/')).toBe('repos/:owner/:repo')
  })
  test('handles when char to trim is special case in regex', () => {
    expect(_.trim('_- hello_- ', '_- ')).toBe('hello')
    expect(_.trim('[]^\\.$*+?(){}|hello[]^\\', '[]^\\.$*+?(){}|')).toBe(
      'hello',
    )
    expect(_.trim('---hello---', '-')).toBe('hello')
    expect(_.trim('...hello...', '.')).toBe('hello')
  })
  test('handles edge cases', () => {
    expect(_.trim('', '_')).toBe('')
    expect(_.trim('hello', '')).toBe('hello')
    expect(_.trim('', '')).toBe('')
    expect(_.trim('___', '_')).toBe('')
    expect(_.trim('_- _-', '_- ')).toBe('')
    expect(_.trim('hello', '_- ')).toBe('hello')
    expect(_.trim('__hello', '_')).toBe('hello')
    expect(_.trim('hello__', '_')).toBe('hello')
    expect(_.trim('_-hello', '_-')).toBe('hello')
    expect(_.trim('hello_-', '_-')).toBe('hello')
    expect(_.trim('✨hello✨', '✨')).toBe('hello')
    expect(_.trim('😀hello😀', '😀')).toBe('hello')
  })
})
