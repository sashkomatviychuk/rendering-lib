type ArrayMethod = 'push' | 'pop' | 'shift' | 'unshift' | 'splice' | 'sort' | 'reverse';

function isArrayMethod(prop: unknown): prop is ArrayMethod {
  return typeof prop === 'string' && ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].includes(prop);
}

export function createReactive<T extends object>(obj: T, onChange: (key: keyof T, value: unknown) => void): T {
  function wrap(value: unknown, parentKey: keyof T): unknown {
    if (Array.isArray(value)) {
      return new Proxy<unknown[]>(value, {
        get(target, prop, receiver) {
          if (isArrayMethod(prop)) {
            return (...args: unknown[]) => {
              const method = (target as unknown[])[prop] as (...args: unknown[]) => unknown;
              const result = method();

              onChange(parentKey, target);

              return result;
            };
          }
          const val = Reflect.get(target, prop, receiver);
          return typeof val === 'object' && val !== null ? wrap(val, parentKey) : val;
        },
        set(target, prop, value, receiver) {
          const result = Reflect.set(target, prop, value, receiver);
          onChange(parentKey, target);
          return result;
        },
      });
    } else if (typeof value === 'object' && value !== null) {
      return createReactive(value, onChange);
    }
    return value;
  }

  return new Proxy(obj, {
    get(target, key, receiver) {
      const value = Reflect.get(target, key, receiver);
      return wrap(value, key as keyof T);
    },
    set(target, key, value, receiver) {
      const wrappedValue = wrap(value, key as keyof T);
      const result = Reflect.set(target, key, wrappedValue, receiver);
      onChange(key as keyof T, wrappedValue);
      return result;
    },
  });
}
