import { ValueObjectAtomicValue } from '@ddd/domain';
import { Specification } from '@ddd/specifications';

import { Deal } from '../../Deal';
import { DealTransaction } from '../DealTransaction';

export class DealTransactionByDealSpecification extends Specification<DealTransaction> {
  constructor(readonly deals: Deal[] | Specification<Deal>) {
    super();

    if (Specification.isExtends(deals)) {
      this.lockLocalSpecify();
    }

    if (Array.isArray(deals)) {
      this.addFilter((transaction) => {
        return deals.some((deal) => {
          return transaction.dealPK.isEquals(deal.primaryKey);
        });
      });
    }
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.deals];
  }
}
