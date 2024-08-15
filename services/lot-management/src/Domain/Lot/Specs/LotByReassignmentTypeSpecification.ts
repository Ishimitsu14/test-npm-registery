import { NullableObject } from '@ddd/core';
import { ValueObjectAtomicValue } from '@ddd/domain';
import { Specification } from '@ddd/specifications';

import { LotReassignmentType } from '../Enums';
import { LotInputs } from '../Inputs';
import { Lot } from '../Lot';

export class LotByReassignmentTypeSpecification extends Specification<Lot> {
  readonly types: LotReassignmentType[];

  constructor(type: LotReassignmentType | LotReassignmentType[]) {
    super();

    this.types = Array.isArray(type) ? type : [type];

    this.addFilter((lot) => {
      const lotReassignmentType = lot.attributes.findValue(LotInputs.INVEST_DOC_REASSIGNMENT_TYPE_INPUT);

      if (NullableObject.isEmpty(lotReassignmentType)) return false;

      return this.types.indexOf(lotReassignmentType) !== -1;
    });
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.types];
  }
}
