import { ValueObjectAtomicValue } from '@ddd/domain';
import { Specification } from '@ddd/specifications';

import { Bid } from '../../Bid';
import { Lot } from '../Lot';

export class LotMatchesBidSpecification extends Specification<Lot> {
  constructor(readonly bids: Bid[] | Specification<Bid>) {
    super();

    if (Specification.isExtends(bids)) {
      this.lockLocalSpecify();
    }

    if (Array.isArray(bids)) {
      this.addFilter((lot) => {
        return bids.some((bid) => {
          return bid.lotPK.isEquals(lot.primaryKey);
        });
      });
    }
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.bids];
  }
}
