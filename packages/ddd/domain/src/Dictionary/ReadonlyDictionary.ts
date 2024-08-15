export interface ReadonlyDictionary<Key, Value> {
  defaults(key?: Key): Value | undefined;
  get(key: Key): Value | undefined;
  getStrict(key: Key): Value | undefined;
  has(key: Key): boolean;
  keys(): Key[];
  values(): Value[];
  entries(): [Key, Value][];
  map<NewValue>(callback: (value: Value, key: Key, dictionary: ReadonlyDictionary<Key, Value>) => NewValue): ReadonlyDictionary<Key, NewValue>;
  readonly length: number;
}
