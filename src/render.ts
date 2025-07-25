import { createReactive } from './reactive';
import { mount, patch, VNode } from './vdom';

export function render(strings: TemplateStringsArray, ...values: any[]) {
  return strings.reduce((out, str, i) => out + str + (values[i] ?? ''), '');
}

type TState = Record<string, unknown>;

type RenderComponentOptions = {
  template: (ctx: { state: TState; props?: Record<string, any> }) => VNode;
  state: TState;
  handlers: Record<string, Function>;
  mountPoint: HTMLElement;
  props?: Record<string, any>;
  onInit?: () => void;
  onDestroy?: () => void;
  scopeId?: string;
};

export function renderComponent({
  template,
  state,
  handlers,
  mountPoint,
  props,
  scopeId,
  onInit,
  onDestroy,
}: RenderComponentOptions) {
  let oldVNode: VNode | null = null;
  const container = document.createElement('div');
  mountPoint.innerHTML = '';
  mountPoint.appendChild(container);

  const reactiveState = createReactive(state, () => update());

  // Bind `this = { state, props }` for all handlers
  for (const [key, fn] of Object.entries(handlers)) {
    handlers[key] = fn.bind({ state: reactiveState, props });
  }

  function update() {
    const newVNode = template({ state: reactiveState, props });
    if (oldVNode) {
      patch(container, oldVNode, newVNode, 0, scopeId);
    } else {
      mount(newVNode, container, scopeId);
    }
    oldVNode = newVNode;
  }

  if (onInit) onInit.call({ state: reactiveState, props });

  // Optional onDestroy when DOM is removed
  if (onDestroy) {
    const observer = new MutationObserver(() => {
      if (!document.body.contains(container)) {
        observer.disconnect();
        onDestroy.call({ state: reactiveState, props });
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  update();
}
