import { ValueObjectAtomicValue } from '@ddd/domain';
import { Specification } from '@ddd/specifications';

import { Deal } from '../../Deal';
import { DealTransaction } from '../../DealTransaction';

export class DealMatchesDealTransactionSpecification extends Specification<Deal> {
  constructor(readonly dealTransactions: DealTransaction[] | Specification<DealTransaction>) {
    super();

    if (Specification.isExtends(dealTransactions)) {
      this.lockLocalSpecify();
    }

    if (Array.isArray(dealTransactions)) {
      this.addFilter((deal) => {
        return dealTransactions.some((transaction) => {
          return transaction.dealPK.isEquals(deal.primaryKey);
        });
      });
    }
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.dealTransactions];
  }
}
