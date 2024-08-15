import { ISnapshot } from '@ddd/infra';
import { Embeddable } from '@mikro-orm/core';
import { BidMakerValidationKR, KeyResultStatus } from 'services/lot-management/src/Domain';

import { KeyResultStatusSnapshot } from '../Enums';

@Embeddable()
export class BidMakerValidationKRSnapshot implements ISnapshot<BidMakerValidationKR> {
  @KeyResultStatusSnapshot({ fieldName: 'status' })
  status: KeyResultStatusSnapshot;

  applyDomain(domain: BidMakerValidationKR): void {
    this.status = domain.status.id;
  }

  toDomain(): BidMakerValidationKR {
    return BidMakerValidationKR.fromSnapshot(KeyResultStatus.getById(this.status));
  }
}
