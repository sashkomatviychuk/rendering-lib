import { h, VNode } from './vdom';

export function html(strings: TemplateStringsArray, ...values: any[]): VNode {
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

      const props: Record<string, any> = {};
      const childVNodes = convertToVNode(el as any).children;

      for (const attr of el.attributes) {
        props[attr.name] = attr.value;
      }

      children.push(h(el.tagName.toLowerCase(), props, ...childVNodes));
    }
  });

  return h('fragment', {}, ...children);
}
