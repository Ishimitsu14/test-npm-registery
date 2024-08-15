import { IRepository } from '@ddd/infra';
import { IQueryRepository } from '@ddd/specifications';

import { ViewLot } from '../ViewLot';
import { ViewLotPk } from '../ViewLotPk';

export interface IViewLotRepository extends IRepository<ViewLot>, IQueryRepository<ViewLot> {
  nextPk(): Promise<ViewLotPk>;
}
