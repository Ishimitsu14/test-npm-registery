import { ISnapshot } from '@ddd/infra';
import { Embeddable, Property } from '@mikro-orm/core';
import { KeyResultStatus, MarsbaseCommissionKR, Percent, Precision } from 'services/lot-management/src/Domain';

import { KeyResultStatusSnapshot } from '../Enums';

@Embeddable()
export class MarsbaseCommissionKRSnapshot implements ISnapshot<MarsbaseCommissionKR> {
  @KeyResultStatusSnapshot({ fieldName: 'status' })
  status: KeyResultStatusSnapshot;

  @Property({ fieldName: 'percent', type: 'float' })
  percent: number;

  applyDomain(domain: MarsbaseCommissionKR): void {
    this.status = domain.status.id;
    this.percent = domain.state.percent.value.toNumber();
  }

  toDomain(): MarsbaseCommissionKR {
    return MarsbaseCommissionKR.fromSnapshot(KeyResultStatus.getById(this.status), Percent.fromFloat(this.percent, Precision.DYNAMIC));
  }
}
