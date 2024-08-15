export type AllKeys<T extends any[]> = (T extends [] ? never : T extends [infer I, ...infer U] ? keyof I | AllKeys<U> : keyof T[number]) & string;
