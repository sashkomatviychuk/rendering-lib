const registry = new Map<string, ReturnType<typeof defineComponent>>();

export function registerComponent(name: string, component: ReturnType<typeof defineComponent>) {
  registry.set(name.toLowerCase(), component);
}

export function getComponent(name: string) {
  return registry.get(name.toLowerCase());
}
