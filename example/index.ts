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
  state: { childText: 'Child content', todos: [{ title: 'Create a new component', done: false }] },
  handlers: {
    onClick(e) {
      this.state.childText = 'Content was modified!';
    },
    addTodo() {
      this.state.todos.push({
        done: false,
        title: 'New todo',
      });
    },
    toggleTodo() {
      if (this.state.todos.length) {
        this.state.todos[0].done = !this.state.todos[0].done;
      }
    },
    onContainerClick(e) {
      this.props.onClick(e);
    },
  },
  propTypes: {
    name: {
      type: String,
    },
    onClick: {
      type: Function,
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
  render({ state, props, event }) {
    return html`
      <div class="parent" onClick="${event('onContainerClick')}">
        <p>Hello, ${props?.name}</p>
        <p>Content: ${state.childText}</p>
        <ul>
          ${state.todos.map(({ done, title }) => `<li>${title} - ${done ? 'Yes' : 'No'}</li>`).join('\n')}
        </ul>
        <button onClick="${event('toggleTodo')}">Toggle first todo</button>
        <button onClick="${event('addTodo')}">Add todo</button>
      </div>
    `;
  },
});

registerComponent('child-component', ChildComponent as any);

ParentComponent.mount(document.getElementById('app')!, {
  name: 'ParentName',
});
