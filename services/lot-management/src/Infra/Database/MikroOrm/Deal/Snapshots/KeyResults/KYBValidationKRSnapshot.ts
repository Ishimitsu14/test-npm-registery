import { ISnapshot } from '@ddd/infra';
import { Embeddable } from '@mikro-orm/core';
import { KeyResultStatus, KYBValidationKR } from 'services/lot-management/src/Domain';

import { KeyResultStatusSnapshot } from '../Enums';

@Embeddable()
export class KYBValidationKRSnapshot implements ISnapshot<KYBValidationKR> {
  @KeyResultStatusSnapshot({ fieldName: 'status' })
  status: KeyResultStatusSnapshot;

  applyDomain(domain: KYBValidationKR): void {
    this.status = domain.status.id;
  }

  toDomain(): KYBValidationKR {
    return KYBValidationKR.fromSnapshot(KeyResultStatus.getById(this.status));
  }
}
