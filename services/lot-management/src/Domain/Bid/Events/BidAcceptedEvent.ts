import { ValueObjectAtomicValue } from '@ddd/domain';
import { AbstractDomainEvent } from '@ddd/events';

import { Bid } from '../Bid';

export class BidAcceptedEvent extends AbstractDomainEvent {
  constructor(readonly bid: Bid) {
    super();
  }

  protected getEventAtomicValues(): ValueObjectAtomicValue {
    return { bid: this.bid };
  }
}
