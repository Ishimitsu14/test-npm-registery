export interface PrototypeType<T> extends Function {
  prototype: T;
}

export interface ConstructorFunctionType<T = any> extends PrototypeType<T> {
  new (...args: any[]): T;
}

export type StaticType<T extends Record<string | symbol, any>> = {
  [Key in keyof T]: T[Key];
};

export type ConstructorType<T = unknown, Static extends Record<string | symbol, any> = PrototypeType<T>> = (PrototypeType<T> | ConstructorFunctionType<T>) & StaticType<Static>;

export type ConstructorInstanceType<T extends ConstructorType<any, any>> = T extends ConstructorType<infer Instance> ? Instance : T extends PrototypeType<infer Instance> ? Instance : never;
