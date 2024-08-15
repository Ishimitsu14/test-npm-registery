import { IRepository } from '@ddd/infra';
import { IQueryRepository } from '@ddd/specifications';

import { Lot } from '../Lot';
import { LotPK } from '../LotPK';

export interface ILotRepository extends IRepository<Lot>, IQueryRepository<Lot> {
  nextPK(): Promise<LotPK>;
}
