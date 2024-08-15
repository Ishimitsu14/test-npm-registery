export type Attribute<Name extends string, Value> = {
  [Key in Name]: Value;
};

type _MergeAttributes<T extends Attribute<any, any>[]> = T extends [infer I, ...infer U] ? I & (U extends [] ? {} : _MergeAttributes<U>) : {};

export type MergeAttributes<T extends Attribute<any, any>[]> = {
  [Key in keyof _MergeAttributes<T> & string as `${Key}`]?: _MergeAttributes<T>[Key];
};
