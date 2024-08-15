import { MikroOrmRepository } from '@shared/db';

import { ILotBadgeRepository, LotBadge, LotBadgePK } from '../../../../Domain';
import { LotBadgeSnapshot } from './Snapshots';

export class LotBadgeRepository extends MikroOrmRepository<LotBadge, LotBadgeSnapshot> implements ILotBadgeRepository {
  readonly EntityType = LotBadge;
  readonly SnapshotType = LotBadgeSnapshot;

  async nextPk(id: string): Promise<LotBadgePK> {
    return LotBadgePK.raw(id);
  }
}
