import { NullableObject } from '@ddd/core';
import { ValueObjectAtomicValue } from '@ddd/domain';
import { Specification } from '@ddd/specifications';

import { DealTransaction } from '../DealTransaction';
import { DealTransactionStatus } from '../Enums';

export class DealTransactionByStatusSpecification extends Specification<DealTransaction> {
  readonly statuses: DealTransactionStatus[];

  constructor(status: DealTransactionStatus | DealTransactionStatus[]) {
    super();

    this.statuses = Array.isArray(status) ? status : [status];

    this.addFilter((transaction) => {
      return NullableObject.hasValue(this.statuses.find((status) => transaction.status.isEquals(status)));
    });
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.statuses];
  }
}
