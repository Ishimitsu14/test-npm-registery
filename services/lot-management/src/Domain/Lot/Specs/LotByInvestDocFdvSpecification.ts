import { Nullable, NullableObject } from '@ddd/core';
import { ValueObjectAtomicValue } from '@ddd/domain';
import { Specification } from '@ddd/specifications';

import { LotInputs } from '../Inputs';
import { Lot } from '../Lot';

export class LotByInvestDocFdvSpecification extends Specification<Lot> {
  constructor(
    readonly min: Nullable<number>,
    readonly max: Nullable<number>,
  ) {
    super();

    this.addFilter((lot) => {
      const summary = lot.attributes.findValue(LotInputs.INVEST_DOC_FDV_INPUT);
      if (NullableObject.isEmpty(summary)) return false;

      const minCondition = NullableObject.hasValue(min) ? summary.value.gte(min) : true;
      const maxCondition = NullableObject.hasValue(max) ? summary.value.lte(max) : true;

      return minCondition && maxCondition;
    });
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.min, this.max];
  }
}
