export type TupleKeys<T extends ReadonlyArray<any>> = Exclude<keyof T, keyof any[]>;
