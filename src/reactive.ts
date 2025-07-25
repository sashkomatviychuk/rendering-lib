export function createReactive<T extends Record<string, unknown>>(
  obj: T,
  onChange: (key: keyof T, value: any) => void
): T {
  return new Proxy(obj, {
    get(target, key) {
      return target[key as keyof T];
    },
    set(target, key, value) {
      target[key as keyof T] = value;
      onChange(key as keyof T, value);
      return true;
    },
  });
}
