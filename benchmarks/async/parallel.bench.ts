import * as _ from 'radashi'

describe('parallel', () => {
  const items10 = _.list(1, 10)
  const items100 = _.list(1, 100)
  const items1000 = _.list(1, 1000)

  bench('10 items (limit 3)', async () => {
    await _.parallel(3, items10, async n => n * 2)
  })

  bench('100 items (limit 10)', async () => {
    await _.parallel(10, items100, async n => n * 2)
  })

  bench('1000 items (limit 10)', async () => {
    await _.parallel(10, items1000, async n => n * 2)
  })
})
