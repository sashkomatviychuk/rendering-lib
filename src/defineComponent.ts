import { renderComponent } from './render';
import {
  ComponentDefinition,
  ComponentDefinitionReturn,
  Handlers,
  InferProps,
  PropTypesDefinition,
  State,
} from './types';

function generateScopeId() {
  return 's-' + Math.random().toString(36).slice(2, 8);
}

export function defineComponent<S extends State, P extends PropTypesDefinition, H extends Handlers<S, InferProps<P>>>(
  def: ComponentDefinition<S, P, H>
): ComponentDefinitionReturn<S, P, H> {
  return {
    def,
    mount(el, props = {} as InferProps<P>, options) {
      const scopeId = def.styles ? generateScopeId() : undefined;

      // Inject scoped <style> once
      if (def.styles && scopeId && !document.querySelector(`[data-style="${scopeId}"]`)) {
        const style = document.createElement('style');
        style.setAttribute('data-style', scopeId);
        style.textContent = def.styles.replace(/:host/g, `[data-scope="${scopeId}"]`);

        document.head.appendChild(style);
      }

      renderComponent<S, InferProps<P>, H>({
        state: def.state,
        render:
          options?.render ??
          (({ state, props }) => {
            return def.render({
              state,
              handlers: Object.keys(def.handlers).reduce((acc, key) => {
                acc[key as keyof H] = key;
                return acc;
              }, {} as any),
              event: (k) => k,
              props: props as any,
            });
          }),
        handlers: def.handlers,
        onInit: def.onInit,
        onDestroy: def.onDestroy,
        props,
        mountPoint: el,
        scopeId,
      });
    },
  };
}
