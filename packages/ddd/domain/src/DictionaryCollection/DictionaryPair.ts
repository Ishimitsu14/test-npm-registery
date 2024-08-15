import { Equatable } from '@ddd/core';

import { ValueObject, ValueObjectAtomicValue } from '../ValueObject';

export class DictionaryPair<Key, Value> extends ValueObject {
  constructor(
    readonly key: Key,
    readonly value: Value,
  ) {
    super();
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return { key: Equatable.wrap(this.key), value: Equatable.wrap(this.value) };
  }
}
