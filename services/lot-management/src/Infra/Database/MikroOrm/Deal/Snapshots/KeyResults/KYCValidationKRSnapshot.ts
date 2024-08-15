import { ISnapshot } from '@ddd/infra';
import { Embeddable } from '@mikro-orm/core';
import { KeyResultStatus, KYCValidationKR } from 'services/lot-management/src/Domain';

import { KeyResultStatusSnapshot } from '../Enums';

@Embeddable()
export class KYCValidationKRSnapshot implements ISnapshot<KYCValidationKR> {
  @KeyResultStatusSnapshot({ fieldName: 'status' })
  status: KeyResultStatusSnapshot;

  applyDomain(domain: KYCValidationKR): void {
    this.status = domain.status.id;
  }

  toDomain(): KYCValidationKR {
    return KYCValidationKR.fromSnapshot(KeyResultStatus.getById(this.status));
  }
}
