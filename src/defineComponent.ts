import { renderComponent } from './render';

function generateScopeId() {
  return 's-' + Math.random().toString(36).slice(2, 8);
}

export function defineComponent(def: {
  state: Record<string, any>;
  template: (ctx: { state: Record<string, any>; props?: Record<string, any> }) => any;
  handlers: Record<string, Function>;
  onInit?: () => void;
  onDestroy?: () => void;
  styles?: string;
}) {
  const scopeId = def.styles ? generateScopeId() : undefined;

  return {
    mount(el: HTMLElement, props: Record<string, any> = {}) {
      // Inject scoped <style> once
      if (def.styles && scopeId && !document.querySelector(`[data-style="${scopeId}"]`)) {
        const style = document.createElement('style');
        style.setAttribute('data-style', scopeId);
        style.textContent = def.styles.replace(/:host/g, `[data-scope="${scopeId}"]`);

        document.head.appendChild(style);
      }

      renderComponent({
        state: def.state,
        template: def.template,
        handlers: def.handlers,
        onInit: def.onInit,
        onDestroy: def.onDestroy,
        props,
        mountPoint: el,
        scopeId,
      });
    },
    def, // optional, for introspection
  };
}
