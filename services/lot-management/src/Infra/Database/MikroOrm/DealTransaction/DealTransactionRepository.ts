import { MikroOrmRepository } from '@shared/db';
import { v4 } from 'uuid';

import { DealTransaction, DealTransactionPK, IDealTransactionRepository } from '../../../../Domain';
import { DealTransactionSnapshot } from './Snapshots';

export class DealTransactionRepository extends MikroOrmRepository<DealTransaction, DealTransactionSnapshot> implements IDealTransactionRepository {
  readonly EntityType = DealTransaction;
  readonly SnapshotType = DealTransactionSnapshot;

  generatePK(): DealTransactionPK {
    return DealTransactionPK.fromSnapshot(v4());
  }
}
