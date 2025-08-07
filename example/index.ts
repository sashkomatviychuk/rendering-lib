import { defineComponent } from '../src/defineComponent';
import { registerComponent } from '../src/registry';
import { html } from '../src/template';
import { childCss, parentCss } from './styles';

interface Todo {
  title: string;
  done: boolean;
}

const ParentComponent = defineComponent({
  state: {
    parentTitle: 'Parent',
  },
  propTypes: {
    name: {
      type: String,
    },
  },
  styles: parentCss,
  handlers: {
    onParentClick() {
      this.state.parentTitle = 'Changed!';
    },
    onSomethingClick() {
      console.log('child click');
    },
  },

  render({ state, props, event }) {
    const vNode = html`
      <div class="parent">
        <h2>${state.parentTitle}</h2>
        <p>${props?.name}</p>
        <button onClick="${event('name')}">Click Parent</button>
        <child-component name="${props?.name}" doomy="${event('onSomethingClick')}"></child-component>
      </div>
    `;

    console.log({ vNode });

    return vNode;
  },
});

const ChildComponent = defineComponent({
  state: {
    childText: 'Child content',
    todos: [{ title: 'Create a new component', done: false }] as Todo[],
  },
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
      console.log({ props1: this.props });
      this.props.handleChildClick(e); // todo
    },
  },
  propTypes: {
    name: {
      type: String,
    },
    handleChildClick: {
      type: Function,
    },
    todos: {
      type: [] as unknown as Todo[],
    },
  },
  styles: childCss,
  render({ state, props, event }) {
    return html`
      <div class="parent">
        <p>Hello, ${props?.name}</p>
        <p>Content: ${state.childText}</p>
        <ul>
          ${state.todos.map(({ done, title }) => `<li>${title} - ${done ? 'Yes' : 'No'}</li>`).join('\n')}
        </ul>
        <div class="container">
          <button onClick="${event('toggleTodo')}">Toggle first todo</button>
          <button onClick="${event('addTodo')}">Add todo</button>
        </div>
      </div>
    `;
  },
});

registerComponent('child-component', ChildComponent as any);

ParentComponent.mount(document.getElementById('app')!, {
  name: 'ParentName',
});
