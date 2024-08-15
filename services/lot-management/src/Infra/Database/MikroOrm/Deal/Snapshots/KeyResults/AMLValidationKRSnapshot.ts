import { ISnapshot } from '@ddd/infra';
import { Embeddable } from '@mikro-orm/core';
import { AMLValidationKR, KeyResultStatus } from 'services/lot-management/src/Domain';

import { KeyResultStatusSnapshot } from '../Enums';

@Embeddable()
export class AMLValidationKRSnapshot implements ISnapshot<AMLValidationKR> {
  @KeyResultStatusSnapshot({ fieldName: 'status' })
  status: KeyResultStatusSnapshot;

  applyDomain(domain: AMLValidationKR): void {
    this.status = domain.status.id;
  }

  toDomain(): AMLValidationKR {
    return AMLValidationKR.fromSnapshot(KeyResultStatus.getById(this.status));
  }
}
