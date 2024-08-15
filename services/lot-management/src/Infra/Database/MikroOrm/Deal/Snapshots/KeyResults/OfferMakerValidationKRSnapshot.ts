import { ISnapshot } from '@ddd/infra';
import { Embeddable } from '@mikro-orm/core';
import { KeyResultStatus, OfferMakerValidationKR } from 'services/lot-management/src/Domain';

import { KeyResultStatusSnapshot } from '../Enums';

@Embeddable()
export class OfferMakerValidationKRSnapshot implements ISnapshot<OfferMakerValidationKR> {
  @KeyResultStatusSnapshot({ fieldName: 'status' })
  status: KeyResultStatusSnapshot;

  applyDomain(domain: OfferMakerValidationKR): void {
    this.status = domain.status.id;
  }

  toDomain(): OfferMakerValidationKR {
    return OfferMakerValidationKR.fromSnapshot(KeyResultStatus.getById(this.status));
  }
}
