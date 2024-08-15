import { UnspecifiedObject } from '../../core';
import { IValueObject } from '../ValueObject';

export type ImmutableObjectValue<Value> = Exclude<Value, UnspecifiedObject>;

export type ImmutableObjectEntry<T> = {
  [K in keyof T]: { key: K; value: ImmutableObjectValue<T[K]> };
}[keyof T];

export interface IImmutableObject<State extends Record<string, any>> extends IValueObject {
  getState(): Readonly<State>;
  get<Key extends keyof State>(key: Key): State[Key];
  getDefault<Key extends keyof State>(key: Key, defaultValueFactory: () => ImmutableObjectValue<State[Key]>): ImmutableObjectValue<State[Key]>;
  reduceState<U>(callbackfn: (previousValue: U, currentValue: ImmutableObjectEntry<State>, currentIndex: number) => U, initialValue: U): U;
  clone(): this;
}
