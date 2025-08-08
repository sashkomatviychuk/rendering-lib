import { EventRef, Handlers, Props, State } from './types';

export function createEventRef<S extends State, P extends Props, H extends Handlers<S, P>>(
  handlers: H,
  props?: P
): EventRef<S, P, H> {
  return ((key) => {
    if (key in handlers) {
      return `ref:handlers.${key}` as any;
    }

    if (props && key in props && typeof props[key] === 'function') {
      return `ref:props.${key}` as any;
    }

    throw new Error(`Invalid key: ${key}`);
  }) as EventRef<S, P, H>;
}
