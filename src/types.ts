export type State = Record<string, unknown>;
export type Props = Record<string, any>;

type PropConstructor<T> = {
  type: T;
};

type ConstructorToType<T> = T extends StringConstructor
  ? string
  : T extends NumberConstructor
  ? number
  : T extends BooleanConstructor
  ? boolean
  : T extends ArrayConstructor
  ? unknown[]
  : T extends ObjectConstructor
  ? object
  : T extends DateConstructor
  ? Date
  : T extends FunctionConstructor
  ? Function
  : T;

export type PropTypesDefinition = {
  [key: string]: PropConstructor<unknown>;
};

export type InferProps<T extends PropTypesDefinition> = {
  [K in keyof T]: ConstructorToType<T[K]['type']>;
};

export type HandlerThis<S extends State, P extends Props> = {
  state: S;
  readonly props: P;
};

export type HandlerFn<S extends State, P extends Props> = (this: HandlerThis<S, P>, event: Event) => void;

export type Handlers<S extends State, P extends Props> = {
  [K in string]: HandlerFn<S, P>;
};

export type RenderFn<S extends State, P extends Props, H extends Handlers<S, P>> = (args: {
  state: S;
  handlers: { [K in keyof H]: string };
  event: <K extends keyof H>(handlerName: K) => K;
  props?: P;
}) => VNode;

export type ComponentDefinition<
  S extends State,
  P extends PropTypesDefinition,
  H extends Handlers<S, InferProps<P>>
> = {
  state: S;
  handlers: H;
  render: RenderFn<S, InferProps<P>, H>;
  propTypes?: P;
  styles?: string;
  onInit?: () => void;
  onDestroy?: () => void;
};

export type ComponentDefinitionReturn<
  S extends State,
  P extends PropTypesDefinition,
  H extends Handlers<S, InferProps<P>>
> = {
  def: ComponentDefinition<S, P, H>;
  mount: (
    el: HTMLElement,
    props?: InferProps<P>,
    options?: {
      render: (ctx: { state: S; props?: InferProps<P> }) => VNode;
      onInit?: () => void;
      onDestroy?: () => void;
    }
  ) => void;
};

export type RenderComponentParams<S extends State, P extends Props, H extends Handlers<S, P>> = {
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
  props: Props;
  children: (VNode | string)[];
};

export type ComponentNodeInstance = {
  dom: HTMLElement | Text;
  vNode: VNode;
  childInstances: ComponentNodeInstance[];
};
