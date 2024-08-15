import { MikroOrmRepository } from '@shared/db';
import { v4 } from 'uuid';

import { FavoriteLot, FavoriteLotPK, IFavoriteLotRepository } from '../../../../Domain';
import { FavoriteLotSnapshot } from './Snapshots';

export class FavoriteLotRepository extends MikroOrmRepository<FavoriteLot, FavoriteLotSnapshot> implements IFavoriteLotRepository {
  readonly EntityType = FavoriteLot;
  readonly SnapshotType = FavoriteLotSnapshot;

  async nextPK(): Promise<FavoriteLotPK> {
    return FavoriteLotPK.raw(v4());
  }
}
