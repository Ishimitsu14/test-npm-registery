import { ValueObjectAtomicValue } from '@ddd/domain';
import { Specification } from '@ddd/specifications';

import { LotStatus } from '../Enums';
import { Lot } from '../Lot';

export class LotByStatusSpecification extends Specification<Lot> {
  readonly statuses: LotStatus[];

  constructor(status: LotStatus | LotStatus[]) {
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
