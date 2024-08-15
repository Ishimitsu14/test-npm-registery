import { ValueObjectAtomicValue } from '@ddd/domain';
import { Specification } from '@ddd/specifications';

import { Bid } from '../../Bid';
import { Deal } from '../../Deal';

export class BidMatchesDealSpecification extends Specification<Bid> {
  constructor(readonly deals: Deal[] | Specification<Deal>) {
    super();

    if (Specification.isExtends(deals)) {
      this.lockLocalSpecify();
    }

    if (Array.isArray(deals)) {
      this.addFilter((bid) => {
        return deals.some((deal) => {
          return deal.bidPK.isEquals(bid.primaryKey);
        });
      });
    }
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.deals];
  }
}
