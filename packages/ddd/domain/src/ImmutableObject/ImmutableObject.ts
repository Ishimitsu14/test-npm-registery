import { NullableObject, UnspecifiedObject } from '@ddd/core';

import { ValueObject, ValueObjectAtomicValue } from '../ValueObject';
import { IImmutableObject, ImmutableObjectEntry, ImmutableObjectValue } from './IImmutableObject';

export class ImmutableObject<State extends Record<string, any>> extends ValueObject implements IImmutableObject<State> {
  private readonly state: Readonly<State>;

  constructor(state: State) {
    super();

    this.state = state;
  }

  getState(): Readonly<State> {
    return Object.assign({}, this.state);
  }

  get<Key extends keyof State>(key: Key): State[Key] {
    return this.state[key];
  }

  getDefault<Key extends keyof State>(key: Key, defaultValueFactory: () => ImmutableObjectValue<State[Key]>): ImmutableObjectValue<State[Key]> {
    const value = this.get(key);
    return UnspecifiedObject(value, defaultValueFactory);
  }

  reduceState<U>(callbackfn: (previousValue: U, currentValue: ImmutableObjectEntry<State>, currentIndex: number) => U, initialValue: U): U {
    return Object.entries(this.state).reduce((out, [key, value], currentIndex) => {
      if (UnspecifiedObject.isUnspecified(value)) return out;
      return callbackfn(out, { key, value }, currentIndex);
    }, initialValue);
  }

  smartReduceState<U>(defaultValue: U, callbackfn: (currentValue: ImmutableObjectEntry<State>) => Partial<U> | NullableObject | null | undefined) {
    return this.reduceState<U>((out, pair) => {
      const value = callbackfn(pair);
      if (NullableObject.isEmpty(value)) return out;

      return Object.assign({}, out, value);
    }, defaultValue);
  }

  clone(): this {
    return this.updateState({});
  }

  protected updateState(state: Partial<State>): this {
    const newState = Object.assign({}, this.state, state);

    return Object.assign(Object.create(Object.getPrototypeOf(this)), Object.assign({}, this), { state: newState });
  }

  protected unset<Key extends keyof State>(key: Key): this {
    const newPartialState: Partial<State> = { [key]: UnspecifiedObject } as any;
    return this.updateState(newPartialState);
  }

  protected set<Key extends keyof State>(key: Key, value: State[Key]): this {
    const newPartialState: Partial<State> = { [key]: value } as any;
    return this.updateState(newPartialState);
  }

  // Использовать только в конструкторе
  protected _constructorUpdateState(state: Partial<State>): void {
    const newState = Object.assign({}, this.state, state);

    Object.defineProperty(this, 'state', { value: newState });
  }

  protected _constructorSet<Key extends keyof State>(key: Key, value: State[Key]): void {
    const newPartialState: Partial<State> = { [key]: value } as any;
    return this._constructorUpdateState(newPartialState);
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [
      Object.keys(this.state)
        .sort()
        .map((key) => this.get(key)),
    ];
  }
}
