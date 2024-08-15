import { NullableObject } from '@ddd/core';
import { ValueObjectAtomicValue } from '@ddd/domain';
import { Specification } from '@ddd/specifications';

import { Deal } from '../Deal';
import { DealStatus } from '../Enums';

export class DealByStatusSpecification extends Specification<Deal> {
  readonly statuses: DealStatus[];

  constructor(status: DealStatus | DealStatus[]) {
    super();

    this.statuses = Array.isArray(status) ? status : [status];

    this.addFilter((lot) => NullableObject.hasValue(this.statuses.find((m) => lot.status.isEquals(m))));
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.statuses];
  }
}
