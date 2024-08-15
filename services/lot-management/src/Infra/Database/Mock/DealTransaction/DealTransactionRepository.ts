import { MockRepository } from '@shared/db';
import { v4 } from 'uuid';

import { DealTransaction, DealTransactionPK, IDealTransactionRepository } from '../../../../Domain';

export class DealTransactionRepository extends MockRepository<DealTransaction> implements IDealTransactionRepository {
  readonly EntityType = DealTransaction;

  generatePK(): DealTransactionPK {
    return DealTransactionPK.fromSnapshot(v4());
  }
}
