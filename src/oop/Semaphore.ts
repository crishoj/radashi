import { noop, type PromiseWithResolvers, withResolvers } from 'radashi'

interface AbortSignal {
  aborted?: boolean
  reason?: unknown
  addEventListener(type: 'abort', listener: () => void): void
  removeEventListener(type: 'abort', listener: () => void): void
}

/**
 * A permit that can be acquired from a {@link Semaphore}.
 */
export class SemaphorePermit {
  private _request: PromiseWithResolvers<void> | undefined

  constructor(
    readonly semaphore: Semaphore,
    request: PromiseWithResolvers<void>,
    readonly weight: number,
  ) {
    this._request = request
  }

  get request(): PromiseWithResolvers<void> {
    return (this._request ??= {
      promise: Promise.resolve(),
      resolve: noop,
      reject: noop,
    })
  }

  /**
   * Releases this permit back to the semaphore, allowing another
   * operation to acquire it.
   */
  release(): void {
    // @ts-expect-error: Protected access
    this.semaphore.release(this)
    this.release = noop
  }
}

/**
 * Options for acquiring a permit from a semaphore.
 */
export type SemaphoreAcquireOptions = {
  signal?: AbortSignal
  weight?: number
}

/**
 * Implements a counting semaphore that controls access to a limited
 * resource. Useful for limiting concurrent operations or access to
 * constrained resources.
 *
 * @see https://radashi.js.org/reference/oop/Semaphore
 * @version 12.6.0
 */
export class Semaphore {
  protected queue: SemaphorePermit[] = []

  /**
   * Current number of permits available to be acquired
   */
  readonly capacity: number

  /**
   * Number of pending acquisition requests.
   */
  get queueLength(): number {
    return this.queue.length
  }

  /**
   * Creates a new semaphore with the specified capacity.
   * @param maxCapacity Maximum number of permits that can be issued simultaneously
   */
  constructor(readonly maxCapacity: number) {
    if (maxCapacity <= 0) {
      throw new Error('maxCapacity must be > 0')
    }
    this.capacity = maxCapacity
  }

  /**
   * Acquires a permit from this semaphore, waiting if necessary until
   * one becomes available.
   * @param options.signal - The signal to abort the acquisition
   * @param options.weight - The weight of the permit to acquire
   * @returns A promise that resolves to a permit when one is
   * available
   */
  acquire(options?: SemaphoreAcquireOptions): Promise<SemaphorePermit> {
    const weight = options?.weight ?? 1
    const signal = options?.signal
    if (weight <= 0) {
      return Promise.reject(new Error('weight must be > 0'))
    }
    if (weight > this.maxCapacity) {
      return Promise.reject(new Error('weight must be ≤ maxCapacity'))
    }
    if (signal?.aborted) {
      return Promise.reject(signal.reason)
    }
    if (this.capacity < weight) {
      return this.enqueue(weight, signal)
    }
    // @ts-expect-error: Allow mutation
    this.capacity -= weight
    return Promise.resolve(new SemaphorePermit(this, undefined!, weight))
  }

  private enqueue(
    weight: number,
    signal?: AbortSignal,
  ): Promise<SemaphorePermit> {
    const request = withResolvers<void>()
    const permit = new SemaphorePermit(this, request, weight)
    if (signal) {
      const abort = () => {
        const index = this.queue.indexOf(permit)
        if (index >= 0) {
          this.queue.splice(index, 1)
          request.reject(signal.reason)
        }
      }
      signal.addEventListener('abort', abort)
      const cleanup = () => {
        signal.removeEventListener('abort', abort)
      }
      // Can't use `promise.finally` in legacy runtimes.
      request.promise.then(cleanup, cleanup)
    }
    this.queue.push(permit)
    return request.promise.then(() => permit)
  }

  /**
   * Rejects all pending acquisition requests.
   */
  reject(error: Error): void {
    this.acquire = () => Promise.reject(error)
    const { queue } = this
    this.queue = []
    for (let i = 0; i < queue.length; i++) {
      queue[i].request.reject(error)
    }
  }

  /**
   * Releases a permit back to the semaphore, increasing capacity and
   * potentially fulfilling a pending acquisition request.
   */
  protected release(permit: SemaphorePermit): void {
    // @ts-expect-error: Allow mutation
    this.capacity += permit.weight

    const { queue } = this
    const len = queue.length
    if (len === 0) {
      return
    }

    // Fulfill queued requests while the available capacity allows it.
    let drained = 0
    while (drained < len && this.capacity >= queue[drained].weight) {
      // Update the capacity immediately to avoid race conditions.
      // @ts-expect-error: Allow mutation
      this.capacity -= queue[drained++].weight
    }

    if (drained === 0) {
      return
    }
    if (drained === 1) {
      queue.shift()!.request.resolve()
      return
    }
    let ready: SemaphorePermit[]
    if (drained === len) {
      ready = queue
      this.queue = []
    } else {
      ready = queue.splice(0, drained)
    }
    for (let i = 0; i < drained; i++) {
      ready[i].request.resolve()
    }
  }
}
