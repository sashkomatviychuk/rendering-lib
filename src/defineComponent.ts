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

export function defineComponent<S extends State, H extends Handlers<S>, P extends PropTypesDefinition>(
  def: ComponentDefinition<S, H, P>
): ComponentDefinitionReturn<S, H, P> {
  const boundHandlers = Object.fromEntries(
    Object.entries(def.handlers).map(([key, handler]) => [key, handler.bind({ state: def.state })])
  ) as H;

  return {
    def: {
      ...def,
      handlers: boundHandlers,
    },
    mount(el, props, options) {
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
          (({ state }) =>
            def.render({
              state,
              handlers: Object.keys(boundHandlers).reduce((acc, key) => {
                acc[key as keyof H] = key;
                return acc;
              }, {} as any),
              event: (k) => k,
            })),
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
