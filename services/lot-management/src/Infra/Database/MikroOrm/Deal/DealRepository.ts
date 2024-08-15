import { MikroOrmRepository } from '@shared/db';

import { Deal, IDealRepository } from '../../../../Domain';
import { DealSnapshot } from './Snapshots';

export class DealRepository extends MikroOrmRepository<Deal, DealSnapshot> implements IDealRepository {
  readonly EntityType = Deal;
  readonly SnapshotType = DealSnapshot;
}
