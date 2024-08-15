import { AllKeys } from './AllKeys';

type NullablePartial<T, Keys extends string> = {
  [Key in Keys as Key]?: Key extends keyof T ? T[Key] : null;
};

type _Merge<T extends any[], Keys extends string> = T extends [infer I, ...infer U] ? (I & Omit<NullablePartial<I, Keys>, keyof I>) | _Merge<U, Keys> : T[number];

export type Merge<T extends any[]> = _Merge<T, AllKeys<T>>;
