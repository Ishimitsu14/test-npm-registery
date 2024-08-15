import { ValueObjectAtomicValue } from '@ddd/domain';
import { Specification } from '@ddd/specifications';

import { Lot } from '../../Lot';
import { Bid } from '../Bid';

export class BidByLotSpecification extends Specification<Bid> {
  constructor(readonly lots: Lot[] | Specification<Lot>) {
    super();

    if (Specification.isExtends(lots)) {
      this.lockLocalSpecify();
    }

    if (Array.isArray(lots)) {
      this.addFilter((bid) => {
        return lots.some((lot) => {
          return bid.lotPK.isEquals(lot.primaryKey);
        });
      });
    }
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.lots];
  }
}
