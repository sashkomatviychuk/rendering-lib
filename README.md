# rendering-lib

A minimal reactive UI library for building component-based web applications with TypeScript.

## Features

- **Reactive State:** Automatic UI updates when state changes.
- **Component System:** Define reusable components with state, props, handlers, and styles.
- **Virtual DOM:** Efficient DOM updates using a simple VDOM implementation.
- **Scoped Styles:** Write CSS directly in your component; styles are automatically scoped to the component using a unique attribute, preventing style leakage or conflicts.
- **Custom Events & Handlers:** Bind event handlers directly in templates.
- **Prop Types:** Define and validate component props.

## Getting Started

### Installation

Clone the repository and install dependencies:

```sh
npm install
```

### Development

Start the example app:

```sh
npm start
```

Open [http://localhost:8081](http://localhost:8081) in your browser.

## Usage

Define a component:

```typescript
import { defineComponent } from './src/defineComponent';
import { html } from './src/template';
import { css } from './src/css';

const MyComponent = defineComponent({
  state: { count: 0 },
  handlers: {
    increment() {
      this.state.count++;
    },
  },
  styles: css`
    .counter {
      color: blue;
    }
  `,
  render({ state, event }) {
    return html`
      <div class="counter">
        <span>${state.count}</span>
        <button onClick="${event('increment')}">Increment</button>
      </div>
    `;
  },
});
```

> **Note:** The `styles` property allows you to define CSS for your component. These styles are automatically scoped using a unique attribute, so they only apply to this component instance.

Mount a component:

```typescript
MyComponent.mount(document.getElementById('app')!);
```

Register and use child components:

```typescript
import { registerComponent } from './src/registry';

registerComponent('my-child', MyComponent);
```

## Example

See [`example/index.ts`](example/index.ts) for a full example with parent and child components, state, props, handlers, and scoped styles.

## File Structure

- [`src/`](src/)
  - [`css.ts`](src/css.ts): Scoped CSS utility.
  - [`defineComponent.ts`](src/defineComponent.ts): Component definition logic.
  - [`reactive.ts`](src/reactive.ts): Reactive state implementation.
  - [`registry.ts`](src/registry.ts): Component registry.
  - [`render.ts`](src/render.ts): Rendering and patching logic.
  - [`template.ts`](src/template.ts): HTML template parsing.
  - [`types.ts`](src/types.ts): Type definitions.
  - [`vdom.ts`](src/vdom.ts): Virtual DOM functions.
- [`example/`](example/)
  - [`index.ts`](example/index.ts): Example usage.
  - [`styles.ts`](example/styles.ts): Example component styles.
  - [`public/index.html`](example/public/index.html): HTML entry point.
  - [`webpack.config.js`](example/webpack.config.js): Webpack config
