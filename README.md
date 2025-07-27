# rendering-lib

A minimal reactive UI library for building component-based web applications with TypeScript.

## Features

- **Reactive State:** Automatic UI updates when state changes.
- **Component System:** Define reusable components with state, props, handlers, and styles.
- **Virtual DOM:** Efficient DOM updates using a simple VDOM implementation.
- **Scoped Styles:** Component styles are scoped using a generated attribute.
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

const MyComponent = defineComponent({
  state: { count: 0 },
  handlers: {
    increment() {
      this.state.count++;
    },
  },
  render({ state }) {
    return html`
      <div>
        <span>${state.count}</span>
        <button onClick="${'increment'}">Increment</button>
      </div>
    `;
  },
});
```

Mount a component:

```typescript
MyComponent.mount(document.getElementById('app')!);
```

Register and use child components:

```typescript
import { registerComponent } from './src/registry';

registerComponent('my-child', MyComponent);
```

## File Structure

- [`src/`](src/)
  - [`defineComponent.ts`](src/defineComponent.ts): Component definition logic.
  - [`reactive.ts`](src/reactive.ts): Reactive state implementation.
  - [`registry.ts`](src/registry.ts): Component registry.
  - [`render.ts`](src/render.ts): Rendering and patching logic.
  - [`template.ts`](src/template.ts): HTML template parsing.
  - [`types.ts`](src/types.ts): Type definitions.
  - [`vdom.ts`](src/vdom.ts): Virtual DOM functions.
- [`example/`](example/)
  - [`index.ts`](example/index.ts): Example usage.
  - [`public/index.html`](example/public/index.html): HTML entry point.
  - [`webpack.config.js`](example/webpack.config.js): Webpack config.