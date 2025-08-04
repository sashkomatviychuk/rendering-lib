import { renderComponent } from './render';
import {
  ComponentDefinition,
  ComponentDefinitionReturn,
  Handlers,
  InferProps,
  PropTypesDefinition,
  State,
} from './types';

export function defineComponent<S extends State, P extends PropTypesDefinition, H extends Handlers<S, InferProps<P>>>(
  def: ComponentDefinition<S, P, H>
): ComponentDefinitionReturn<S, P, H> {
  return {
    def,
    mount(el, props = {} as InferProps<P>, options) {
      renderComponent<S, InferProps<P>, H>({
        state: def.state,
        render:
          options?.render ??
          (({ state, props }) => {
            return def.render({
              state,
              event: (k) => k,
              props,
            });
          }),
        handlers: def.handlers,
        onInit: def.onInit,
        onDestroy: def.onDestroy,
        props,
        mountPoint: el,
        scopeId: def.styles,
      });
    },
  };
}
