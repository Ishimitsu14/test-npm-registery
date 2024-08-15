import { ISnapshot } from '@ddd/infra';
import { Embeddable } from '@mikro-orm/core';
import { AgentCommissionKR, KeyResultStatus } from 'services/lot-management/src/Domain';

import { KeyResultStatusSnapshot } from '../Enums';

@Embeddable()
export class AgentCommissionKRSnapshot implements ISnapshot<AgentCommissionKR> {
  @KeyResultStatusSnapshot({ fieldName: 'status' })
  status: KeyResultStatusSnapshot;

  applyDomain(domain: AgentCommissionKR): void {
    this.status = domain.status.id;
  }

  toDomain(): AgentCommissionKR {
    return AgentCommissionKR.fromSnapshot(KeyResultStatus.getById(this.status));
  }
}
