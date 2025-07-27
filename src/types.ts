export type State = Record<string, any>;
export type Props = Record<string, any>;

type PropConstructor<T> = {
  type: T;
};

export type PropTypesDefinition = {
  [key: string]: PropConstructor<any>;
};

export type InferProps<T extends PropTypesDefinition> = {
  [K in keyof T]: T[K]['type'];
};

export type HandlerThis<S extends State> = {
  state: S;
};

export type HandlerFn<S extends State> = (this: HandlerThis<S>, event: Event) => void;

export type Handlers<S extends State> = {
  [K in string]: HandlerFn<S>;
};

export type RenderFn<S extends State, H extends Handlers<S>, P = undefined> = (args: {
  state: S;
  handlers: { [K in keyof H]: string };
  event: <K extends keyof H>(handlerName: K) => K;
  props?: P;
}) => VNode;

export type ComponentDefinition<S extends State, H extends Handlers<S>, P extends PropTypesDefinition> = {
  state: S;
  handlers: H;
  render: RenderFn<S, H, P>;
  propTypes?: P;
  styles?: string;
  onInit?: () => void;
  onDestroy?: () => void;
};

export type ComponentDefinitionReturn<S extends State, H extends Handlers<S>, P extends PropTypesDefinition> = {
  def: ComponentDefinition<S, H, P>;
  mount: (
    el: HTMLElement,
    props?: InferProps<P>,
    options?: {
      render: (ctx: { state: S; props?: InferProps<P> }) => VNode;
      onInit?: () => void;
      onDestroy?: () => void;
      scopeId?: string;
    }
  ) => void;
};

export type RenderComponentParams<S extends State, P, H extends Handlers<S>> = {
  state: S;
  handlers: H;
  props?: P;
  mountPoint: HTMLElement;
  render: (ctx: { state: S; props?: P }) => VNode;
  onInit?: () => void;
  onDestroy?: () => void;
  scopeId?: string;
};

export type VNode = {
  type: string;
  props: Record<string, any>;
  children: (VNode | string)[];
};
