import { defineComponent } from '../src/defineComponent';
import { registerComponent } from '../src/registry';
import { html } from '../src/template';

const ParentComponent = defineComponent({
  state: { parentTitle: 'Parent' },
  propTypes: {
    name: {
      type: String,
    },
  },
  handlers: {
    onParentClick() {
      this.state.parentTitle = 'Changed!';
    },
    onClick() {
      console.log('child click');
    },
  },

  render({ state, props }) {
    return html`
      <div class="parent">
        <h2>${state.parentTitle}</h2>
        <p>${props?.name}</p>
        <button onClick="${'onParentClick'}">Click Parent</button>
        <child-component name="${props?.name}" onClick="${'onClick'}"></child-component>
      </div>
    `;
  },
});

const ChildComponent = defineComponent({
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
  styles: `
    :host .parent {
      background: #ccc;
    }

    :host button {
      background: #fff;
      border: 2px solid purple;
      outline: none;
      padding: 4px;
    }
  `,
  render({ state, props }) {
    return html`
      <div class="parent">
        <p>Hello, ${props?.name}</p>
        <p>Content: ${state.childText}</p>
        <button onClick="${'onClick'}">Modify content</button>
      </div>
    `;
  },
});

registerComponent('child-component', ChildComponent as any);

ParentComponent.mount(document.getElementById('app')!, {
  name: 'ParentName' as any,
});
