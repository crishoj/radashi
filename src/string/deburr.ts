const DEBURR_MAP: Record<number, string> = {
  0x00c6: 'Ae', // Æ
  0x00d0: 'D', // Ð
  0x00d8: 'O', // Ø
  0x00de: 'Th', // Þ
  0x00df: 'ss', // ß
  0x00e6: 'ae', // æ
  0x00f0: 'd', // ð
  0x00f8: 'o', // ø
  0x00fe: 'th', // þ
  0x0110: 'D', // Đ
  0x0111: 'd', // đ
  0x0126: 'H', // Ħ
  0x0127: 'h', // ħ
  0x0131: 'i', // ı
  0x0132: 'IJ', // Ĳ
  0x0133: 'ij', // ĳ
  0x0138: 'k', // ĸ
  0x013f: 'L', // Ŀ
  0x0140: 'l', // ŀ
  0x0141: 'L', // Ł
  0x0142: 'l', // ł
  0x0149: "'n", // ŉ
  0x014a: 'N', // Ŋ
  0x014b: 'n', // ŋ
  0x0152: 'Oe', // Œ
  0x0153: 'oe', // œ
  0x0166: 'T', // Ŧ
  0x0167: 't', // ŧ
  0x017f: 's', // ſ
}

/**
 * Removes accents and converts extended Latin ligatures to basic Latin text.
 *
 * @see https://radashi.js.org/reference/string/deburr
 * @example
 * ```ts
 * deburr('déjà vu') // => 'deja vu'
 * deburr('Ærøskøbing') // => 'Aeroskobing'
 * ```
 * @version 12.8.0
 */
export function deburr(input: string): string {
  let start = 0
  for (; start < input.length; start++) {
    if (input.charCodeAt(start) >= 0xc0) {
      break
    }
  }
  if (start === input.length) {
    return input
  }

  const chars = input.normalize('NFD')
  let result = ''
  let lastIndex = 0

  for (let index = start; index < chars.length; index++) {
    const code = chars.charCodeAt(index)
    if (code < 0xc6) {
      continue
    }
    if (code <= 0x017f) {
      const replacement = DEBURR_MAP[code]
      if (replacement !== undefined) {
        result += chars.slice(lastIndex, index) + replacement
        lastIndex = index + 1
      }
    } else if (
      (code >= 0x0300 && code <= 0x036f) ||
      (code >= 0xfe20 && code <= 0xfe23)
    ) {
      result += chars.slice(lastIndex, index)
      lastIndex = index + 1
    }
  }

  return lastIndex === 0 ? chars : result + chars.slice(lastIndex)
}
