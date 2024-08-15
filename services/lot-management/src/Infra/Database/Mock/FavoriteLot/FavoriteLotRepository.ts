import { MockRepository } from '@shared/db';
import { v4 } from 'uuid';

import { FavoriteLot, FavoriteLotPK, IFavoriteLotRepository } from '../../../../Domain';

export class FavoriteLotRepository extends MockRepository<FavoriteLot> implements IFavoriteLotRepository {
  readonly EntityType = FavoriteLot;

  async nextPK(): Promise<FavoriteLotPK> {
    return FavoriteLotPK.raw(v4());
  }
}
