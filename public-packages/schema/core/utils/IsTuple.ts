export type IsTuple<T extends ReadonlyArray<any>> = number extends T['length'] ? false : true;
