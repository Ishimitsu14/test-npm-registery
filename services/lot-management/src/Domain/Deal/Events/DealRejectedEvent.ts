import { ValueObjectAtomicValue } from '@ddd/domain';
import { AbstractDomainEvent } from '@ddd/events';

import { Deal } from '../Deal';

export class DealRejectedEvent extends AbstractDomainEvent {
  constructor(readonly deal: Deal) {
    super();
  }

  protected getEventAtomicValues(): ValueObjectAtomicValue {
    return { deal: this.deal };
  }
}
