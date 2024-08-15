import { ValueObjectAtomicValue } from '@ddd/domain';
import { AbstractDomainEvent } from '@ddd/events';

import { Deal } from '../Deal';
import { DealKeyResults } from '../ValueObjects';

export class DealUpdatedKeyResultsEvent extends AbstractDomainEvent {
  constructor(
    readonly deal: Deal,
    readonly prevKeyResults: DealKeyResults,
  ) {
    super();
  }

  protected getEventAtomicValues(): ValueObjectAtomicValue {
    return { deal: this.deal, prevKeyResults: this.prevKeyResults };
  }
}
