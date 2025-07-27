import { defineComponent } from '../src/defineComponent';
import { html } from '../src/template';

export const ParentComponent = defineComponent({
  state: { parentTitle: 'Parent' },
  handlers: {
    onParentClick() {
      alert('From parent: ' + this.state.parentTitle);
    },
  },
  render({ state }) {
    return html`
      <h2>${state.parentTitle}</h2>
      <button onClick="${'onParentClick'}">Click Parent</button>
      <child-component name="Jonh Done"></child-component>
    `;
  },
});

export const ChildComponent = defineComponent({
  state: { childText: 'Child content' },
  handlers: {
    onClick() {
      this.state.childText = 'Content was modified!';
    },
  },
  propTypes: {
    name: {
      type: String,
    },
  },
  render({ state, props }) {
    return html`
      <div>
        <p>Hello, ${props?.name}</p>
        <p>Content: ${state.childText}</p>
        <button onClick="${'onClick'}">Modify content</button>
      </div>
    `;
  },
});

ParentComponent.mount(document.getElementById('app')!);
