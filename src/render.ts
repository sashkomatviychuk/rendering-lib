import { createReactive } from './reactive';
import { Handlers, Props, RenderComponentParams, State, VNode } from './types';
import { mount, patch } from './vdom';

export function render(strings: TemplateStringsArray, ...values: any[]) {
  return strings.reduce((out, str, i) => out + str + (values[i] ?? ''), '');
}

export function renderComponent<S extends State, P extends Props, H extends Handlers<S>>({
  render,
  state,
  handlers,
  mountPoint,
  props,
  scopeId,
  onInit,
  onDestroy,
}: RenderComponentParams<S, P, H>) {
  let oldVNode: VNode | null = null;
  const container = document.createElement('div');

  mountPoint.innerHTML = '';
  mountPoint.appendChild(container);

  const reactiveState = createReactive(state, () => update());

  const bindHandlersToProps = (vNode: VNode | string) => {
    if (typeof vNode === 'string') {
      return;
    }

    const props = vNode.props;

    Object.entries(props).forEach(([key, value]) => {
      if (value in handlers) {
        props[key] = handlers[value].bind({ state: reactiveState });
      }
    });
    vNode.children.forEach((vNode) => bindHandlersToProps(vNode));
  };

  function update() {
    const newVNode = render({ state: reactiveState, props });

    bindHandlersToProps(newVNode);

    if (oldVNode) {
      patch(container, oldVNode, newVNode, 0, scopeId);
    } else {
      mount(newVNode, container, scopeId);
    }
    oldVNode = newVNode;
  }

  if (onInit) {
    onInit.call({ state: reactiveState, props });
  }

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
