import { getComponent } from './registry';
import { Props, VNode } from './types';

export function h(type: string, props: Props, ...children: (VNode | string)[]): VNode {
  return {
    type,
    props: props ?? {},
    children,
  };
}

export function mount(vnode: VNode | string, container: HTMLElement, scopeId?: string): Node | undefined {
  if (typeof vnode === 'string') {
    const text = document.createTextNode(vnode);
    container.appendChild(text);
    return text;
  }

  if (vnode.type === 'fragment') {
    vnode.children.forEach((child) => mount(child, container, scopeId));
    return container;
  }

  if (vnode.type === '__component__') {
    const tag = vnode.props.tag;
    const component = getComponent(tag);

    if (!component) {
      return;
    }

    const el = document.createElement('div');
    const props = { ...vnode.props };
    delete props.tag;

    component.mount(el, props);

    // mount only elements created by component
    el.childNodes.forEach((node) => {
      container.appendChild(node);
    });

    return el;
  }

  const el = document.createElement(vnode.type);

  if (scopeId) {
    el.setAttribute('data-scope', scopeId);
  }

  Object.entries(vnode.props).forEach(([key, val]) => {
    if (key.startsWith('on')) {
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

      if (newEl) {
        parent.replaceChild(newEl, el);
      }
    }
  } else if (oldVNode.type !== newVNode.type) {
    const newEl = mount(newVNode, document.createElement('div'), scopeId);

    if (newEl) {
      parent.replaceChild(newEl, el);
    }
  } else {
    // Update props
    const element = el as HTMLElement;
    const oldProps = oldVNode.props;
    const newProps = newVNode.props;

    // Remove stale props
    Object.keys(oldProps).forEach((key) => {
      if (key in newProps) {
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
      console.log({ element });
      if (element.nodeType !== Node.TEXT_NODE) {
        element.setAttribute('data-scope', scopeId);
      }
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
