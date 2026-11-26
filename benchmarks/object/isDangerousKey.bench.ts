import * as _ from 'radashi'

const plainObject = {}
const nullProtoObject = Object.create(null)

describe('isDangerousKey', () => {
  bench('safe key with plain object', () => {
    _.isDangerousKey('foo', plainObject)
  })

  bench('dangerous key with plain object', () => {
    _.isDangerousKey('__proto__', plainObject)
  })

  bench('dangerous key with null-prototype object', () => {
    _.isDangerousKey('__proto__', nullProtoObject)
  })

  bench('safe key without object', () => {
    _.isDangerousKey('foo')
  })
})
