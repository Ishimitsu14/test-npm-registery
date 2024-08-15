import { ValueObjectAtomicValue } from '@ddd/domain';
import { Specification } from '@ddd/specifications';

import { LotPK } from '../../Lot';
import { ViewLot } from '../ViewLot';

export class ViewLotByLotSpecification extends Specification<ViewLot> {
  readonly lotPks: LotPK[];

  constructor(lotId: LotPK | LotPK[]) {
    super();

    this.lotPks = Array.isArray(lotId) ? lotId : [lotId];

    this.addFilter((viewLot) => {
      return this.lotPks.some((m) => viewLot.lotId.isEquals(m));
    });
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.lotPks];
  }
}
