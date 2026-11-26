// cSpell:ignore fabiospampinato

/**
 * Calculate the similarity between two strings using the Levenshtein
 * distance algorithm.
 *
 * One thing to note is that the argument order is unimportant. The
 * algorithm will always return the same result regardless of the
 * order of the arguments.
 *
 * Adapted from
 * [@fabiospampinato/tiny-levenshtein](https://github.com/fabiospampinato/tiny-levenshtein)
 * with ❤️.
 *
 * @see https://radashi.js.org/reference/string/similarity
 * @example
 * ```ts
 * similarity('abc', 'abc') // 0
 * similarity('a', 'b') // 1
 * similarity('ab', 'ac') // 1
 * similarity('ac', 'bc') // 1
 * similarity('abc', 'axc') // 1
 * similarity('kitten', 'sitting') // 3
 * ```
 * @version 12.2.0
 */
export function similarity(str1: string, str2: string): number {
  // Early return if strings are identical
  if (str1 === str2) {
    return 0
  }

  // Ensure str1 is no longer than str2 so buffers use O(min(m, n)) memory.
  if (str1.length > str2.length) {
    const tmp = str1
    str1 = str2
    str2 = tmp
  }

  // Find common prefix and suffix
  let start = 0
  let end1 = str1.length - 1
  let end2 = str2.length - 1

  while (start <= end1 && str1.charCodeAt(start) === str2.charCodeAt(start)) {
    start++
  }

  while (end1 >= start && str1.charCodeAt(end1) === str2.charCodeAt(end2)) {
    end1--
    end2--
  }

  // Calculate lengths of trimmed strings
  const length1 = end1 - start + 1
  const length2 = end2 - start + 1

  // Handle cases where one string is a substring of the other
  if (length1 === 0) {
    return length2
  }

  // Keep one row of the distance table and str1's code units in typed arrays.
  const row = new Int32Array(length1)
  const codes = new Uint16Array(length1)
  for (let y = 0; y < length1; y++) {
    row[y] = y + 1
    codes[y] = str1.charCodeAt(start + y)
  }

  for (let x = 0; x < length2; x++) {
    let diagonal = x
    let left = x + 1
    const char2 = str2.charCodeAt(start + x)
    for (let y = 0; y < length1; y++) {
      const above = row[y]
      if (codes[y] === char2) {
        left = diagonal
      } else {
        const min = left < above ? left : above
        left = (diagonal < min ? diagonal : min) + 1
      }
      row[y] = left
      diagonal = above
    }
  }

  // Return the Levenshtein distance
  return row[length1 - 1]
}
