import { ValueObjectAtomicValue } from '@ddd/domain';
import { Specification } from '@ddd/specifications';

import { BidByLotSpecification } from '../../Bid';
import { DealByBidSpecification } from '../../Deal';
import { DealTransaction, DealTransactionByDealSpecification } from '../../DealTransaction';
import { Lot } from '../../Lot';

export class DealTransactionMatchesLotSpecification extends Specification<DealTransaction> {
  constructor(readonly lots: Lot[] | Specification<Lot>) {
    super();

    this.addSpecification(new DealTransactionByDealSpecification(new DealByBidSpecification(new BidByLotSpecification(lots))));
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.lots];
  }
}
