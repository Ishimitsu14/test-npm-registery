import { ValueObjectAtomicValue } from '@ddd/domain';
import { AbstractDomainEvent } from '@ddd/events';

import { Asset } from '../Asset';

export class AssetArchivedEvent extends AbstractDomainEvent {
  constructor(readonly asset: Asset) {
    super();
  }

  protected getEventAtomicValues(): ValueObjectAtomicValue {
    return { asset: this.asset };
  }
}
