import { h } from './vdom';
import { getComponent } from './registry';
import { Props, VNode } from './types';

export function html(strings: TemplateStringsArray, ...values: unknown[]): VNode {
  const rawHtml = strings.reduce((acc, str, i) => acc + str + (values[i] ?? ''), '');

  const parser = new DOMParser();
  const doc = parser.parseFromString(`<template>${rawHtml}</template>`, 'text/html');
  const template = doc.querySelector('template')!;

  return convertToVNode(template.content);
}

function convertToVNode(fragment: DocumentFragment): VNode {
  const children: (VNode | string)[] = [];

  fragment.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();

      if (text) {
        children.push(text);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();
      const props: Props = {};

      for (const attr of el.attributes) {
        props[attr.name] = attr.value;
      }

      const childVNode = convertToVNode(el as any).children;

      if (getComponent(tag)) {
        children.push(h('__component__', { tag, ...props }, ...childVNode));
      } else {
        children.push(h(tag, props, ...childVNode));
      }
    }
  });

  // If fragment then no need to render it
  return h('fragment', {}, ...children);
}
