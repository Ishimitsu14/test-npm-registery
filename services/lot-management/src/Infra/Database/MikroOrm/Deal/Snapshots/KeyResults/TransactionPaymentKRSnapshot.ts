import { ISnapshot } from '@ddd/infra';
import { Embeddable } from '@mikro-orm/core';
import { KeyResultStatus, TransactionPaymentKR } from 'services/lot-management/src/Domain';

import { KeyResultStatusSnapshot } from '../Enums';

@Embeddable()
export class TransactionPaymentKRSnapshot implements ISnapshot<TransactionPaymentKR> {
  @KeyResultStatusSnapshot({ fieldName: 'status' })
  status: KeyResultStatusSnapshot;

  applyDomain(domain: TransactionPaymentKR): void {
    this.status = domain.status.id;
  }

  toDomain(): TransactionPaymentKR {
    return TransactionPaymentKR.fromSnapshot(KeyResultStatus.getById(this.status));
  }
}
