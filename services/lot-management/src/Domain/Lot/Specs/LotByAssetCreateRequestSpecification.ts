import { NullableObject } from '@ddd/core';
import { ValueObjectAtomicValue } from '@ddd/domain';
import { Specification } from '@ddd/specifications';

import { LotInputs } from '../Inputs';
import { Lot } from '../Lot';

export class LotByAssetCreateRequestSpecification extends Specification<Lot> {
  constructor(readonly title: string) {
    super();

    this.addFilter((lot) => {
      const createRequest = lot.attributes.findValue(LotInputs.INVEST_DOC_ASSET_CREATE_REQUEST_INPUT);

      if (NullableObject.isEmpty(createRequest)) return false;

      return createRequest.title.toLowerCase() === this.title.toLowerCase();
    });
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.title];
  }
}
