import { ValueObjectAtomicValue } from '@ddd/domain';
import { AbstractDomainEvent } from '@ddd/events';

import { FavoriteLot } from '../FavoriteLot';

export class FavoriteLotRemovedEvent extends AbstractDomainEvent {
  constructor(readonly favoriteLot: FavoriteLot) {
    super();
  }

  protected getEventAtomicValues(): ValueObjectAtomicValue {
    return { favoriteLot: this.favoriteLot };
  }
}
