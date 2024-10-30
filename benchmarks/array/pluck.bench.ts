import * as _ from 'radashi'

describe('pluck', () => {
  bench('with non-empty array', () => {
    const people = [
      { name: 'John', age: 20 },
      { name: 'Jane', age: 21 },
      { name: 'Joe', age: 22 },
      { name: 'Jill', age: 23 },
      { name: 'Jim', age: 24 },
    ]
    _.pluck(people, 'name')
  })
})
