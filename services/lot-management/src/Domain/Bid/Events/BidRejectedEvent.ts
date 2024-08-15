import { ValueObjectAtomicValue } from '@ddd/domain';
import { AbstractDomainEvent } from '@ddd/events';

import { Bid } from '../Bid';
import { BidRejectReason } from '../Enums';

export class BidRejectedEvent extends AbstractDomainEvent {
  constructor(
    readonly bid: Bid,
    readonly rejectReason: BidRejectReason,
  ) {
    super();
  }

  protected getEventAtomicValues(): ValueObjectAtomicValue {
    return { bid: this.bid, rejectReason: this.rejectReason };
  }
}
