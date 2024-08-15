import { ValueObjectAtomicValue } from '@ddd/domain';
import { AbstractDomainEvent } from '@ddd/events';

import { LotType } from '../Enums';
import { Lot } from '../Lot';

export class LotChangedCategoryEvent extends AbstractDomainEvent {
  constructor(
    readonly lot: Lot,
    readonly prevCategory: LotType,
  ) {
    super();
  }

  protected getEventAtomicValues(): ValueObjectAtomicValue {
    return { lot: this.lot, prevCategory: this.prevCategory };
  }
}
