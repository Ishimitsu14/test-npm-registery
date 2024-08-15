import { ValueObjectAtomicValue } from '@ddd/domain';
import { Specification } from '@ddd/specifications';

import { Bid } from '../Bid';
import { BidStatus } from '../Enums';

export class BidByStatusSpecification extends Specification<Bid> {
  readonly statuses: BidStatus[];

  constructor(status: BidStatus | BidStatus[]) {
    super();

    this.statuses = Array.isArray(status) ? status : [status];

    this.addFilter((lot) => {
      return this.statuses.indexOf(lot.status) !== -1;
    });
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.statuses];
  }
}
