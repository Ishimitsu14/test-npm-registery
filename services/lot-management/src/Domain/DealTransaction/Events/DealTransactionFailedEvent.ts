import { ValueObjectAtomicValue } from '@ddd/domain';
import { AbstractDomainEvent } from '@ddd/events';

import { DealTransaction } from '../DealTransaction';

export class DealTransactionFailedEvent extends AbstractDomainEvent {
  constructor(readonly lotTransaction: DealTransaction) {
    super();
  }

  protected getEventAtomicValues(): ValueObjectAtomicValue {
    return { lotTransaction: this.lotTransaction };
  }
}
