import { DynamicAttribute, ValuePointer } from '@ddd/core';

import { ValueObject } from '../ValueObject';
import { IEntityKey } from './IEntityKey';

export abstract class EntityKey extends ValueObject implements IEntityKey {
  hasKey() {
    const atomicValues = this.getAtomicValues();
    const notDefinedDynamic = Object.keys(atomicValues).some((key) => {
      const m = atomicValues[key];
      const value = ValuePointer.isExtends(m) ? m.resolve() : m;
      return DynamicAttribute.isExtends(value) && !value.hasValue();
    });

    return !notDefinedDynamic;
  }
}
