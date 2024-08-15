import { NullableObject } from '../../core';
import { IValueObject } from '../ValueObject';

export interface IStateObject<State> extends IValueObject {
  get state(): Readonly<State>;

  get<Key extends keyof State>(key: Key): State[Key];
}

export type StateObjectInferState<T> = T extends IStateObject<infer State> ? State : never;

export type StateObjectUpdateCallback<Value> = Value | ((value: Value) => Value);
export type StateObjectUpdatePromiseCallback<Value> = Promise<Value> | ((value: Value) => Promise<Value>);

// // Helpers
// type Without<T, Keys extends string> = { [P in Keys as `${P}`]: P extends keyof T ? T[P] : NullableObject };
// export type AllKeys<T extends any[]> = T extends [] ? never : T extends [infer I, ...infer U] ? keyof I | AllKeys<U> : keyof T[number];
// // type MergeByKeys<T extends any[], Keys extends string> = T extends [infer I, ...infer U] ? Without<I, Keys> | MergeByKeys<U, Keys> : T[number];
// export type MergeByKeys<T extends any[], Keys extends string> = T extends [infer I, ...infer U]
//   ? { [Key in keyof Without<I, Keys> as `${Key}`]: Without<I, Keys>[Key] } | MergeByKeys<U, Keys>
//   : T[number];
// export type Merge<T extends any[]> = MergeByKeys<T, AllKeys<T> & string>;

// export type MergeTwoTypes<I, U> = {
//   [Key in AllKeys<[I, U]> & string as `${Key & string}`]: Key extends keyof I & keyof U
//     ? I[Key] | U[Key]
//     : Key extends keyof I
//     ? I[Key] | NullableObject
//     : Key extends keyof U
//     ? U[Key] | NullableObject
//     : never;
// };
// export type MergeManyTypes<T extends any[]> = T extends [infer I, ...infer U]
//   ?
//       | {
//           [Key in AllKeys<T> & string as `${Key}`]: Key extends keyof I ? I[Key] : NullableObject;
//         }
//       | MergeManyTypes<U>
//   : T[number];

// export type MergeIntoSingleState<T extends any[]> = {
//   [Key in keyof Merge<T> as `${Key & string}`]: Merge<T>[Key];
// };

export type AddType<T, Type> = {
  [Key in keyof T]: T[Key] | Type;
};

export type AllKeys<T extends any[]> = (T extends [] ? never : T extends [infer I, ...infer U] ? keyof I | AllKeys<U> : keyof T[number]) & string;

type _Merge<T extends any[], Keys extends string, TNull = NullableObject> = T extends [infer I, ...infer U]
  ?
      | {
          [Key in Keys & string as `${Key}`]: Key extends keyof I ? I[Key] : TNull;
        }
      | _Merge<U, Keys, TNull>
  : T[number];

export type Merge<T extends any[], TNull = NullableObject> = _Merge<T, AllKeys<T> & string, TNull>;

export type MergeSingle<T extends any[], TNull = NullableObject> = {
  [Key in Merge<T, TNull>]: Merge<T, TNull>[Key];
};

export type MapObject<T> = {
  [Key in keyof T & string as `${Key}`]: T[Key];
};
