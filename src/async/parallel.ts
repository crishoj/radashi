import { AggregateError, isNumber } from 'radashi'

type AbortSignal = {
  readonly aborted: boolean
  readonly reason: any
  addEventListener(type: 'abort', listener: () => void): void
  removeEventListener(type: 'abort', listener: () => void): void
  throwIfAborted(): void
}

type WorkError = {
  index: number
  error: any
}

export type ParallelOptions = {
  /**
   * The maximum number of functions to run concurrently. If a
   * negative number is passed, only one function will run at a time.
   * If a number bigger than the array `length` is passed, the array
   * length will be used.
   */
  limit: number
  signal?: AbortSignal
}

/**
 * Executes many async functions in parallel. Returns the results from
 * all functions as an array. After all functions have resolved, if
 * any errors were thrown, they are rethrown in an instance of
 * AggregateError. The operation can be aborted by passing optional AbortSignal,
 * which will throw an Error if aborted.
 *
 * @see https://radashi.js.org/reference/async/parallel
 * @example
 * ```ts
 * // Process images concurrently, resizing each image to a standard size.
 * const abortController = new AbortController();
 * const images = await parallel(
 * {
 *  limit: 2,
 *  signal: abortController.signal,
 * },
 *  imageFiles,
 *  async file => {
 *   return await resizeImage(file)
 * })
 *
 * // To abort the operation:
 * // abortController.abort()
 * ```
 * @version 12.1.0
 */
export async function parallel<T, K>(
  options: ParallelOptions | number,
  array: readonly T[],
  func: (item: T) => Promise<K>,
): Promise<K[]> {
  if (!array.length) {
    return []
  }

  let limit: number
  let signal: AbortSignal | undefined
  if (isNumber(options)) {
    limit = options
  } else {
    limit = options.limit
    signal = options.signal
    signal?.throwIfAborted()
  }

  // Snapshot the array (skipping holes) so later mutation by the
  // caller doesn't affect which items are processed.
  const work = array.filter(() => true)
  const { length } = work
  const workerCount =
    limit > length ? length : limit >= 1 ? Math.floor(limit) : 1
  const results: K[] = new Array(length)
  let errors: WorkError[] | undefined
  // Items are taken from the end of the array, like `work.pop()` did.
  let nextIndex = length

  const runWorker = async () => {
    while (nextIndex > 0 && !signal?.aborted) {
      const index = --nextIndex
      try {
        results[index] = await func(work[index])
      } catch (error) {
        errors ??= []
        errors.push({ index, error })
      }
    }
  }

  const workers: Promise<void>[] = new Array(workerCount)
  for (let i = 0; i < workerCount; i++) {
    workers[i] = runWorker()
  }
  const done = Promise.all(workers)

  if (signal) {
    let onAbort: () => void
    const signalPromise = new Promise<never>((_, reject) => {
      onAbort = () => reject(signal.reason)
      signal.addEventListener('abort', onAbort)
    })
    try {
      await Promise.race([done, signalPromise])
    } finally {
      signal.removeEventListener('abort', onAbort!)
    }
  } else {
    await done
  }

  if (errors) {
    errors.sort((a, b) => a.index - b.index)
    throw new AggregateError(errors.map(e => e.error))
  }

  return results
}
