import * as _ from 'radashi'

describe('Semaphore', () => {
  bench('acquire and release without contention', async () => {
    const semaphore = new _.Semaphore(1)
    for (let i = 0; i < 100; i++) {
      const permit = await semaphore.acquire()
      permit.release()
    }
  })

  bench('contended queue drain (capacity 1, 200 waiters)', async () => {
    const semaphore = new _.Semaphore(1)
    const held = await semaphore.acquire()
    const waiters: Promise<void>[] = []
    for (let i = 0; i < 200; i++) {
      waiters.push(semaphore.acquire().then(permit => permit.release()))
    }
    held.release()
    await Promise.all(waiters)
  })

  bench('contended batch queue drain (200 waiters)', async () => {
    const semaphore = new _.Semaphore(200)
    const held = await semaphore.acquire({ weight: 200 })
    const waiters: Promise<_.SemaphorePermit>[] = []
    for (let i = 0; i < 200; i++) {
      waiters.push(semaphore.acquire())
    }
    held.release()
    const permits = await Promise.all(waiters)
    for (let i = 0; i < permits.length; i++) {
      permits[i].release()
    }
  })
})
