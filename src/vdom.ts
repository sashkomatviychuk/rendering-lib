import { getComponent } from './registry';
import { VNode } from './types';

export function h(type: string, props: Record<string, any>, ...children: (VNode | string)[]): VNode {
  return { type, props: props || {}, children };
}

export function mount(vnode: VNode | string, container: HTMLElement, scopeId?: string): Node {
  if (typeof vnode === 'string') {
    const text = document.createTextNode(vnode);
    container.appendChild(text);
    return text;
  }

  if (vnode.type === '__component__') {
    const tag = vnode.props.tag;
    const component = getComponent(tag);
    const el = document.createElement('div');

    const props = { ...vnode.props };
    delete props.tag;

    component?.mount(el, props);
    container.appendChild(el);

    return el;
  }

  const el = document.createElement(vnode.type);

  if (scopeId) {
    el.setAttribute('data-scope', scopeId);
  }

  Object.entries(vnode.props).forEach(([key, val]) => {
    if (key.startsWith('on')) {
      console.log({ props: vnode.props });

      el.addEventListener(key.slice(2).toLowerCase(), val);
    } else {
      el.setAttribute(key, val);
    }
  });

  vnode.children.forEach((child) => mount(child, el, scopeId));
  container.appendChild(el);

  return el;
}

export function patch(parent: Node, oldVNode: VNode | string, newVNode: VNode | string, index = 0, scopeId?: string) {
  const el = parent.childNodes[index];

  if (!oldVNode) {
    mount(newVNode, parent as HTMLElement, scopeId);
  } else if (!newVNode) {
    parent.removeChild(el);
  } else if (typeof oldVNode === 'string' || typeof newVNode === 'string') {
    if (oldVNode !== newVNode) {
      const newEl =
        typeof newVNode === 'string'
          ? document.createTextNode(newVNode)
          : mount(newVNode, document.createElement('div'), scopeId);
      parent.replaceChild(newEl, el);
    }
  } else if (oldVNode.type !== newVNode.type) {
    const newEl = mount(newVNode, document.createElement('div'), scopeId);
    parent.replaceChild(newEl, el);
  } else {
    // Update props
    const element = el as HTMLElement;
    const oldProps = oldVNode.props;
    const newProps = newVNode.props;

    // Remove stale props
    Object.keys(oldProps).forEach((key) => {
      if (!(key in newProps)) {
        if (key.startsWith('on')) {
          element.removeEventListener(key.slice(2).toLowerCase(), oldProps[key]);
        } else {
          element.removeAttribute(key);
        }
      }
    });

    // Add/update new props
    Object.entries(newProps).forEach(([key, val]) => {
      if (key.startsWith('on') && typeof val === 'function') {
        element.addEventListener(key.toLowerCase().slice(2), val);
      } else {
        element.setAttribute(key, val);
      }
    });

    // Ensure scope attribute is preserved
    if (scopeId) {
      element.setAttribute('data-scope', scopeId);
    }

    // Patch children
    const oldChildren = oldVNode.children;
    const newChildren = newVNode.children;
    const max = Math.max(oldChildren.length, newChildren.length);

    for (let i = 0; i < max; i++) {
      patch(element, oldChildren[i], newChildren[i], i, scopeId);
    }
  }
}
