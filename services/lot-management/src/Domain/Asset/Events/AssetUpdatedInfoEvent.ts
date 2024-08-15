import { ValueObjectAtomicValue } from '@ddd/domain';
import { AbstractDomainEvent } from '@ddd/events';

import { Asset } from '../Asset';
import { AssetInfo } from '../ValueObjects';

export class AssetUpdatedInfoEvent extends AbstractDomainEvent {
  constructor(
    readonly asset: Asset,
    readonly prevInfo: AssetInfo,
  ) {
    super();
  }

  protected getEventAtomicValues(): ValueObjectAtomicValue {
    return { asset: this.asset, prevInfo: this.prevInfo };
  }
}
