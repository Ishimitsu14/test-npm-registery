import { NullableObject } from '../../core';
import { ValueObject, ValueObjectAtomicValue } from '../ValueObject';
import { IStateObject, StateObjectUpdateCallback, StateObjectUpdatePromiseCallback } from './IStateObject';

export abstract class StateObject<State> extends ValueObject implements IStateObject<State> {
  private readonly __state: State;

  protected constructor() {
    super();
  }

  get state() {
    this._guardInitializedState();

    return Object.assign({}, this.__state);
  }

  get<Key extends keyof State>(key: Key): State[Key] {
    return this.state[key];
  }

  /**
   * Использовать только в конструкторе. Первичная инициализация
   * @param state State
   */
  protected initState(state: State) {
    this._guardInitState();

    this.__constructorSetState(state);
  }

  protected get isInitializedState() {
    return !!this.__state;
  }

  protected setState(state: State): this {
    this._guardState(state);

    const self: this = Object.assign(Object.create(Object.getPrototypeOf(this)), Object.assign({}, this));
    self.initState(state);

    return self;
  }

  protected updateState(state: Partial<State> = {}): this {
    return this.setState(Object.assign({}, this.state, state));
  }

  protected set<Key extends keyof State>(key: Key, value: StateObjectUpdateCallback<State[Key]>): this {
    const resolvedValue = this.resolveUpdateCallback(key, value);
    return this.updateState({ [key]: resolvedValue } as unknown as Partial<State>);

    // if (isPromise(resolvedValue)) {
    //   return resolvedValue.then((resolvedValue) => {
    //     const newPartialState = { [key]: resolvedValue } as any;
    //     return this.clone(newPartialState);
    //   });
    // }
  }

  protected __constructorSetState(state: State): void {
    this._guardState(state);

    Object.defineProperty(this, '__state', { value: state });
  }

  protected __constructorUpdateState(state: Partial<State>): void {
    return this.__constructorSetState(Object.assign({}, this.state, state));
  }

  protected __constructorSet<Key extends keyof State>(key: Key, value: State[Key]): void {
    return this.__constructorUpdateState({ [key]: value } as unknown as Partial<State>);
  }

  protected resolveUpdateCallback<Key extends keyof State>(key: Key, value: StateObjectUpdateCallback<State[Key]>): State[Key];
  protected resolveUpdateCallback<Key extends keyof State>(key: Key, value: StateObjectUpdatePromiseCallback<State[Key]>): Promise<State[Key]>;
  protected resolveUpdateCallback<Key extends keyof State>(key: Key, value: StateObjectUpdateCallback<State[Key]> | StateObjectUpdatePromiseCallback<State[Key]>): State[Key] | Promise<State[Key]>;
  protected resolveUpdateCallback<Key extends keyof State>(key: Key, value: StateObjectUpdateCallback<State[Key]> | StateObjectUpdatePromiseCallback<State[Key]>): State[Key] | Promise<State[Key]> {
    if (typeof value === 'function' && !NullableObject.isExtends(value)) {
      value = (<Function>value)(this.get(key)) as State[Key] | Promise<State[Key]>;
    }

    return value;
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.state];
  }

  private _guardState(state: State) {
    if (typeof state === 'undefined' || state === null || typeof state !== 'object') throw new TypeError('StateObject: state is not defined. Use valid state object and not null or undefined.');
  }

  private _guardInitState() {
    if (this.isInitializedState) {
      throw new TypeError('StateObject: state is already initialized in this instance.');
    }
  }

  private _guardInitializedState() {
    if (!this.isInitializedState) {
      throw new TypeError('StateObject: state is not initialized in this instance.');
    }
  }
}
