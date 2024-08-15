import { ValueObjectAtomicValue } from '@ddd/domain';
import { AbstractDomainEvent } from '@ddd/events';

import { DealTransaction } from '../DealTransaction';

export class DealTransactionReservedEvent extends AbstractDomainEvent {
  constructor(readonly lotTransaction: DealTransaction) {
    super();
  }

  protected getEventAtomicValues(): ValueObjectAtomicValue {
    return { lotTransaction: this.lotTransaction };
  }
}
