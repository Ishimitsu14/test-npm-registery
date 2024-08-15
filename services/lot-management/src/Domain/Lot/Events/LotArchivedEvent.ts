import { ValueObjectAtomicValue } from '@ddd/domain';
import { AbstractDomainEvent } from '@ddd/events';

import { Lot } from '../Lot';

export class LotArchivedEvent extends AbstractDomainEvent {
  constructor(readonly lot: Lot) {
    super();
  }

  protected getEventAtomicValues(): ValueObjectAtomicValue {
    return { lot: this.lot };
  }
}
