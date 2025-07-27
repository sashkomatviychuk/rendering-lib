export function createReactive<T extends object>(obj: T, onChange: (key: keyof T, value: any) => void): T {
  function wrap(value: any, parentKey: keyof T): any {
    if (Array.isArray(value)) {
      return new Proxy(value, {
        get(target, prop, receiver) {
          if (
            typeof prop === 'string' &&
            ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].includes(prop)
          ) {
            return (...args: any[]) => {
              const result = (target as any)[prop](...args);
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
      return createReactive(value, onChange as any);
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
