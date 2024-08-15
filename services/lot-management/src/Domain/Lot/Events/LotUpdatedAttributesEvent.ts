import { ValueObjectAtomicValue } from '@ddd/domain';
import { AbstractDomainEvent } from '@ddd/events';

import { AttributeValueListCollection } from '../Abstract';
import { Lot } from '../Lot';

export class LotUpdatedAttributesEvent extends AbstractDomainEvent {
  constructor(
    readonly lot: Lot,
    readonly prevAttributes: AttributeValueListCollection,
  ) {
    super();
  }

  protected getEventAtomicValues(): ValueObjectAtomicValue {
    return { lot: this.lot, prevAttributes: this.prevAttributes };
  }
}
