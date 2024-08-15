import { IRepository } from '@ddd/infra';
import { IQueryRepository } from '@ddd/specifications';

import { FavoriteLot } from '../FavoriteLot';
import { FavoriteLotPK } from '../FavoriteLotPK';

export interface IFavoriteLotRepository extends IRepository<FavoriteLot>, IQueryRepository<FavoriteLot> {
  nextPK(): Promise<FavoriteLotPK>;
}
