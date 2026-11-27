import * as _ from 'radashi'

describe('cloneDeep', () => {
  test('simple object with no nested objects', () => {
    const source = { a: 1, b: 'test' }
    const result = _.cloneDeep(source)
    expect(result).toEqual(source)
    expect(result).not.toBe(source)
  })

  test('object with nested objects', () => {
    const source = { a: 1, b: { c: 2 } }
    const result = _.cloneDeep(source)
    expect(result).toEqual(source)
    expect(result.b).not.toBe(source.b)
  })

  test('object with multiple levels of nested objects', () => {
    const source = { a: 1, b: { c: { d: 2 } } }
    const result = _.cloneDeep(source)
    expect(result).toEqual(source)
    expect(result.b).not.toBe(source.b)
    expect(result.b.c).not.toBe(source.b.c)
  })

  test('object with arrays and nested arrays', () => {
    const source = { a: [1, [2]], b: { c: [3, 4] } }
    const result = _.cloneDeep(source)
    expect(result).toEqual(source)
    expect(result.a).not.toBe(source.a)
    expect(result.a[1]).not.toBe(source.a[1])
    expect(result.b.c).not.toBe(source.b.c)
  })

  test('object with complex types of nested objects', () => {
    const source = { a: { b: new Date(), c: /test/g, d: () => {} } }
    const result = _.cloneDeep(source)
    expect(result).toEqual(source)
    expect(result).not.toBe(source)
    expect(result.a).not.toBe(source.a)
    expect(result.a.b).toBe(source.a.b)
    expect(result.a.c).toBe(source.a.c)
    expect(result.a.d).toBe(source.a.d)
  })

  test('object with non-enumerable properties', () => {
    const source = { a: 1 }
    Object.defineProperty(source, 'b', { value: 2, enumerable: false })
    const result = _.cloneDeep(source)
    expect(result).toEqual(source)
    expect(Object.getOwnPropertyDescriptor(result, 'b')).toEqual({
      value: 2,
      writable: false,
      enumerable: false,
      configurable: false,
    })
  })

  test('object with accessors, descriptors, and symbol keys', () => {
    const sym = Symbol('sym')
    const hiddenSym = Symbol('hidden')
    const source: any = { _x: 1, [sym]: { nested: true } }
    Object.defineProperty(source, 'x', {
      get() {
        return this._x
      },
      set(v: number) {
        this._x = v
      },
      enumerable: true,
      configurable: true,
    })
    Object.defineProperty(source, 'readonly', {
      value: { a: 1 },
      writable: false,
      enumerable: true,
      configurable: true,
    })
    Object.defineProperty(source, 'sealed', {
      value: { b: 2 },
      writable: true,
      enumerable: true,
      configurable: false,
    })
    Object.defineProperty(source, hiddenSym, {
      value: { c: 3 },
      writable: true,
      enumerable: false,
      configurable: true,
    })

    const result = _.cloneDeep(source)
    expect(result).not.toBe(source)
    expect(result.x).toBe(1)
    result.x = 42
    expect(result._x).toBe(42)
    expect(source._x).toBe(1)

    expect(result.readonly).toEqual({ a: 1 })
    expect(result.readonly).not.toBe(source.readonly)
    expect(Object.getOwnPropertyDescriptor(result, 'readonly')?.writable).toBe(
      false,
    )

    expect(result.sealed).toEqual({ b: 2 })
    expect(result.sealed).not.toBe(source.sealed)
    expect(
      Object.getOwnPropertyDescriptor(result, 'sealed')?.configurable,
    ).toBe(false)

    expect(result[sym]).toEqual({ nested: true })
    expect(result[sym]).not.toBe(source[sym])
    expect(result[hiddenSym]).toEqual({ c: 3 })
    expect(result[hiddenSym]).not.toBe(source[hiddenSym])
    expect(Object.getOwnPropertyDescriptor(result, hiddenSym)?.enumerable).toBe(
      false,
    )
  })

  test('object with own __proto__ property does not mutate prototype', () => {
    const source = JSON.parse('{"__proto__":{"polluted":true},"a":1}')
    const result = _.cloneDeep(source)
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype)
    expect(Object.prototype.hasOwnProperty.call(result, '__proto__')).toBe(true)
    const srcDesc = Object.getOwnPropertyDescriptor(source, '__proto__')!
    const resDesc = Object.getOwnPropertyDescriptor(result, '__proto__')!
    expect(resDesc.value).toEqual({ polluted: true })
    expect(resDesc.value).not.toBe(srcDesc.value)
    expect(result.a).toBe(1)
  })

  test('own keys shadowing read-only or accessor Object.prototype properties', () => {
    // Simulates frozen intrinsics (e.g. SES lockdown) and inherited
    // accessors, where plain assignment would throw or hit a setter.
    const setter = vi.fn()
    Object.defineProperty(Object.prototype, '__radashiReadOnly__', {
      value: 'inherited',
      writable: false,
      configurable: true,
    })
    Object.defineProperty(Object.prototype, '__radashiAccessor__', {
      get: () => 'inherited',
      set: setter,
      configurable: true,
    })
    try {
      const source = {
        __radashiReadOnly__: { a: 1 },
        __radashiAccessor__: { b: 2 },
      }
      const result = _.cloneDeep(source)
      expect(Object.keys(result)).toEqual(Object.keys(source))
      expect(result.__radashiReadOnly__).toEqual({ a: 1 })
      expect(result.__radashiReadOnly__).not.toBe(source.__radashiReadOnly__)
      expect(result.__radashiAccessor__).toEqual({ b: 2 })
      expect(setter).not.toHaveBeenCalled()
    } finally {
      delete (Object.prototype as any).__radashiReadOnly__
      delete (Object.prototype as any).__radashiAccessor__
    }
  })

  test('null-prototype objects and custom class instances', () => {
    const nullProto = Object.create(null)
    nullProto.a = { b: 1 }
    const clonedNull = _.cloneDeep(nullProto)
    expect(Object.getPrototypeOf(clonedNull)).toBeNull()
    expect(clonedNull.a).toEqual({ b: 1 })
    expect(clonedNull.a).not.toBe(nullProto.a)

    let setterCalls = 0
    class Custom {
      value: { n: number }
      constructor(n: number) {
        this.value = { n }
      }
      set prop(_v: unknown) {
        setterCalls++
      }
    }
    const instance = new Custom(5)
    Object.defineProperty(instance, 'prop', {
      value: { k: 1 },
      writable: true,
      enumerable: true,
      configurable: true,
    })

    const clonedInstance = _.cloneDeep(instance)
    expect(clonedInstance).toBeInstanceOf(Custom)
    expect(clonedInstance).not.toBe(instance)
    expect(clonedInstance.value).toEqual({ n: 5 })
    expect(clonedInstance.value).not.toBe(instance.value)
    expect(setterCalls).toBe(0)
  })

  test('sparse arrays and arrays containing undefined', () => {
    const sparse: any[] = new Array(3)
    sparse[0] = { a: 1 }
    sparse[2] = undefined

    const result = _.cloneDeep(sparse)
    expect(result).not.toBe(sparse)
    expect(result.length).toBe(3)
    expect(result[0]).toEqual({ a: 1 })
    expect(result[0]).not.toBe(sparse[0])
    expect(1 in result).toBe(false)
    expect(2 in result).toBe(true)
    expect(result[2]).toBeUndefined()
  })

  test('object containing Set and Map instances', () => {
    const source = {
      a: new Set([{ a: 1 }, { a: 2 }]),
      b: new Map([[{ b: 1 }, { b: 2 }]]),
    }

    const result = _.cloneDeep(source)
    expect(result).toEqual(source)

    expect(result.a).not.toBe(source.a)
    expect(result.b).not.toBe(source.b)

    // Objects inside sets are cloned.
    expect([...result.a].every(item => !source.a.has(item))).toBe(true)

    // Object keys in maps are *not* cloned.
    // Object values in maps are cloned.
    expect(
      [...result.b].every(
        ([key, value]) => source.b.has(key) && source.b.get(key) !== value,
      ),
    ).toBe(true)
  })

  test('handle circular references', () => {
    const source: any = { a: 1, arr: [], map: new Map(), set: new Set() }
    source.b = source
    source.arr.push(source.arr)
    source.map.set('self', source.map)
    source.set.add(source.set)

    const result = _.cloneDeep(source)
    expect(result).not.toBe(source)
    expect(result).toEqual(source)
    expect(result.b).toBe(result)
    expect(result.arr[0]).toBe(result.arr)
    expect(result.map.get('self')).toBe(result.map)
    expect(result.set.has(result.set)).toBe(true)
  })

  test('avoid cloning an object more than once', () => {
    const source: any = { a1: { b: 1 } }
    source.a2 = source.a1
    const result = _.cloneDeep(source)
    expect(result).toEqual(source)
    expect(result.a1).toBe(result.a2)
    expect(result.a1).not.toBe(source.a1)
  })

  test('avoid calling the mapper for a skipped object more than once', () => {
    const source: any = { a1: { b: 1 } }
    source.a2 = source.a1

    const cloneObject = vi.fn(obj => (obj !== source ? obj : null))
    _.cloneDeep(source, {
      cloneObject,
    })

    // Once for the root object, another for the nested object that
    // appears twice.
    expect(cloneObject).toHaveBeenCalledTimes(2)
  })

  test('custom strategy using track and cloning nested values', () => {
    const source = { a: 1, nested: { b: 2 }, arr: [1, 2], date: new Date(0) }
    const result = _.cloneDeep(source, {
      cloneObject(input, track, clone) {
        const copy: any = track({} as any)
        for (const key of Object.keys(input)) {
          copy[key] = clone((input as any)[key])
        }
        return copy
      },
      cloneOther(input, track) {
        if (input instanceof Date) {
          return track(new Date(input.getTime()) as any)
        }
        return null
      },
    })

    expect(result).toEqual(source)
    expect(result).not.toBe(source)
    expect(result.nested).not.toBe(source.nested)
    expect(result.arr).not.toBe(source.arr)
    expect(result.date).not.toBe(source.date)
    expect(result.date.getTime()).toBe(0)
  })

  describe('FastCloningStrategy', () => {
    test('object with non-enumerable and computed properties', () => {
      const source = {
        a: 1,
        get b() {
          return this.a + 1
        },
      }
      Object.defineProperty(source, 'c', { value: 2, enumerable: false })

      const result = _.cloneDeep(source, _.FastCloningStrategy)

      expect(result.a).toBe(source.a)
      expect(result.b).toBe(source.b)
      expect('get' in Object.getOwnPropertyDescriptor(result, 'b')!).toBe(false)
      expect('c' in result).toBe(false)
    })

    test('nested objects, arrays, and circular references', () => {
      const source: any = { a: { b: [1, { c: 2 }] } }
      source.self = source

      const result = _.cloneDeep(source, _.FastCloningStrategy)
      expect(result).not.toBe(source)
      expect(result.a).not.toBe(source.a)
      expect(result.a.b).not.toBe(source.a.b)
      expect(result.a.b[1]).not.toBe(source.a.b[1])
      expect(result.self).toBe(result)
    })

    test('ignores inherited enumerable properties on Object.prototype', () => {
      const protoKey = '__radashiTestProtoProp__'
      Object.defineProperty(Object.prototype, protoKey, {
        value: { inherited: true },
        enumerable: true,
        configurable: true,
        writable: true,
      })
      try {
        const source = { a: { b: 1 } }
        const result = _.cloneDeep(source, _.FastCloningStrategy)
        expect(result).toEqual({ a: { b: 1 } })
        expect(result.a).not.toBe(source.a)
        expect(Object.prototype.hasOwnProperty.call(result, protoKey)).toBe(
          false,
        )
      } finally {
        delete (Object.prototype as any)[protoKey]
      }
    })
  })
})
