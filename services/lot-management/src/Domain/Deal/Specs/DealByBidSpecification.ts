import { ValueObjectAtomicValue } from '@ddd/domain';
import { Specification } from '@ddd/specifications';

import { Bid } from '../../Bid';
import { Deal } from '../Deal';

export class DealByBidSpecification extends Specification<Deal> {
  constructor(readonly bids: Bid[] | Specification<Bid>) {
    super();

    if (Specification.isExtends(bids)) {
      this.lockLocalSpecify();
    }

    if (Array.isArray(bids)) {
      this.addFilter((deal) => {
        return bids.some((bid) => {
          return deal.bidPK.isEquals(bid.primaryKey);
        });
      });
    }
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.bids];
  }
}
