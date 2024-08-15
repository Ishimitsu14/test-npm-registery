type PathItem<Key extends string | number, Value, AtomicType> = Value extends AtomicType ? `${Key}` : `${Key}.${Path<Value, AtomicType>}`;

export type Path<T, AtomicType> = {
  [Key in keyof T]-?: PathItem<Key & string, T[Key], AtomicType>;
}[keyof T];

export type PathValue<T, AtomicType, TPath extends Path<T, AtomicType>> = TPath extends `${infer Prefix}.${infer Postfix}`
  ? Prefix extends keyof T
    ? Postfix extends Path<T[Prefix], AtomicType>
      ? PathValue<T[Prefix], AtomicType, Postfix>
      : never
    : never
  : TPath extends keyof T
    ? T[TPath]
    : never;
