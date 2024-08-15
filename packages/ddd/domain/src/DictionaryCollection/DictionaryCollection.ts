import { Equatable, ListCollection, Nullable, NullableObject, ReadonlyListCollection } from '@ddd/core';

import { DictionaryPair } from './DictionaryPair';

export interface ReadonlyDictionaryCollection<Key, Value> extends ReadonlyListCollection<DictionaryPair<Key, Value>> {
  hasKey(key: Key): boolean;
  findByKey(key: Key): Nullable<DictionaryPair<Key, Value>>;
  findIndexByKey(key: Key): number;
  findValueByKey(key: Key): Nullable<Value>;
  clone(): ReadonlyDictionaryCollection<Key, Value>;
}

export class DictionaryCollection<Key, Value> extends ListCollection<DictionaryPair<Key, Value>> implements ReadonlyDictionaryCollection<Key, Value> {
  override clone() {
    return new DictionaryCollection(this);
  }

  override add(key: Key, value: Value): void;
  override add(item: DictionaryPair<Key, Value>): void;
  override add(arg_0: DictionaryPair<Key, Value> | Key, arg_1?: Value): void;
  override add(arg_0: DictionaryPair<Key, Value> | Key, arg_1?: Value): void {
    if (DictionaryPair.isExtends(arg_0)) {
      this.removeByKey(arg_0.key);
      super.add(arg_0);
    } else {
      this.removeByKey(arg_0);
      super.add(new DictionaryPair(arg_0, arg_1));
    }
  }

  override asReadonly(): ReadonlyDictionaryCollection<Key, Value> {
    return this;
  }

  addDefaults(dictionary: DictionaryCollection<Key, Value>) {
    for (const pair of dictionary.items) {
      if (!this.hasKey(pair.key)) this.add(pair);
    }
  }

  hasKey(key: Key) {
    return NullableObject.hasValue(this.findByKey(key));
  }

  removeByKey(key: Key) {
    const pair = this.findByKey(key);
    if (NullableObject.hasValue(pair)) this.remove(pair);
  }

  findByKey(key: Key) {
    return this.findCallback((m) => Equatable.isEquals(m.key, key));
  }

  findIndexByKey(key: Key) {
    return this.findIndexCallback((m) => Equatable.isEquals(m.key, key));
  }

  findValueByKey(key: Key) {
    return NullableObject.map(this.findByKey(key), (pair) => pair.value);
  }

  onlySupportedKeys(collection: ReadonlyListCollection<Key>) {
    const unsupportedPairs = this.items.filter((pair) => !collection.isExists(pair.key));

    for (const pair of unsupportedPairs) {
      this.remove(pair);
    }
  }
}
