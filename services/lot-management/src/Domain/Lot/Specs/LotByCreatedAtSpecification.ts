import { Nullable, NullableObject } from '@ddd/core';
import { ValueObjectAtomicValue } from '@ddd/domain';
import { Specification } from '@ddd/specifications';
import { isAfter, isBefore } from 'date-fns';

import { Lot } from '../Lot';

export class LotByCreatedAtSpecification extends Specification<Lot> {
  constructor(
    readonly min: Nullable<number>,
    readonly max: Nullable<number>,
  ) {
    super();

    this.addFilter((lot) => {
      const minCondition = NullableObject.hasValue(min) ? isAfter(lot.createdAt, min) : true;
      const maxCondition = NullableObject.hasValue(max) ? isBefore(lot.createdAt, max) : true;

      return minCondition && maxCondition;
    });
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.min, this.max];
  }
}
