declare const setTimeout: (fn: () => void, ms: number) => unknown

export type ThrottledFunction<TArgs extends any[]> = {
  (...args: TArgs): void
  /**
   * Checks if there is any invocation throttled
   */
  isThrottled(): boolean
}

/**
 * Given an interval and a function returns a new function that will
 * only call the source function if interval milliseconds have passed
 * since the last invocation.
 *
 * @see https://radashi-org.github.io/reference/curry/throttle
 * @example
 * ```ts
 * const sup = throttle({ interval: 1000 }, () => {
 *   console.log("sup")
 * })
 * sup() // => logs "sup"
 * sup() // => no logs
 * setTimeout(() => sup(), 500) // => no logs
 * setTimeout(() => sup(), 1000) // => logs "sup"
 * ```
 */
export function throttle<TArgs extends any[]>(
  { interval, trailing = false }: { interval: number; trailing?: boolean },
  func: (...args: TArgs) => any,
): ThrottledFunction<TArgs> {
  let timer: ReturnType<typeof setTimeout> | undefined
  let lastCalled = 0
  let trailingArgs: TArgs | undefined

  const throttled: ThrottledFunction<TArgs> = (...args: TArgs) => {
    if (Date.now() - lastCalled >= interval) {
      func(...args)
      lastCalled = Date.now()
      trailingArgs = undefined
    } else if (trailing) {
      trailingArgs = args
    }

    timer ??= setTimeout(() => {
      timer = undefined
      if (trailing && trailingArgs) {
        func(...trailingArgs)
        lastCalled = Date.now()
        trailingArgs = undefined
      }
    }, interval)
  }

  throttled.isThrottled = () => {
    return timer !== undefined
  }

  return throttled
}
