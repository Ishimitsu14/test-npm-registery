import { ISnapshot } from '@ddd/infra';
import { Embeddable } from '@mikro-orm/core';
import { AgentValidationKR, KeyResultStatus } from 'services/lot-management/src/Domain';

import { KeyResultStatusSnapshot } from '../Enums';

@Embeddable()
export class AgentValidationKRSnapshot implements ISnapshot<AgentValidationKR> {
  @KeyResultStatusSnapshot({ fieldName: 'status' })
  status: KeyResultStatusSnapshot;

  applyDomain(domain: AgentValidationKR): void {
    this.status = domain.status.id;
  }

  toDomain(): AgentValidationKR {
    return AgentValidationKR.fromSnapshot(KeyResultStatus.getById(this.status));
  }
}
