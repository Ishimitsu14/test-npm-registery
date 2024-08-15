import { ValueObjectAtomicValue } from '@ddd/domain';
import { AbstractDomainEvent } from '@ddd/events';

import { Lot } from '../Lot';

export class LotHasBeenDuplicatedEvent extends AbstractDomainEvent {
  constructor(
    readonly lot: Lot,
    readonly newLot: Lot,
  ) {
    super();
  }

  protected getEventAtomicValues(): ValueObjectAtomicValue {
    return { lot: this.lot, newLot: this.newLot };
  }
}
