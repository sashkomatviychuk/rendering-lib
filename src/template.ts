import { h } from './vdom';
import { getComponent } from './registry';
import { Props, VNode } from './types';

const isTextNode = (node: Node): node is Text => node instanceof Text;
const isElementNode = (node: Node): node is HTMLElement => node instanceof HTMLElement;

export function html(strings: TemplateStringsArray, ...values: unknown[]): VNode {
  const rawHtml = strings.reduce((acc, str, i) => acc + str + (values[i] ?? ''), '');

  const parser = new DOMParser();
  const doc = parser.parseFromString(`<template>${rawHtml}</template>`, 'text/html');
  const template = doc.querySelector('template')!;

  return convertToVNode(template.content);
}

function convertToVNode(fragment: DocumentFragment | HTMLElement): VNode {
  // todo: refactor VNode type
  const children: (VNode | string)[] = [];

  fragment.childNodes.forEach((node) => {
    if (isTextNode(node)) {
      const text = node.textContent.trim();

      if (text) {
        children.push(text);
      }
    } else if (isElementNode(node)) {
      const tag = node.tagName.toLowerCase();
      const props: Props = {};

      for (const attr of node.attributes) {
        props[attr.name] = attr.value;
      }

      const childVNode = convertToVNode(node).children;

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
