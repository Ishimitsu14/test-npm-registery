import { IRepository } from '@ddd/infra';
import { IQueryRepository } from '@ddd/specifications';

import { LotBadge } from '../LotBadge';
import { LotBadgePK } from '../LotBadgePK';

export interface ILotBadgeRepository extends IRepository<LotBadge>, IQueryRepository<LotBadge> {
  nextPk(id: string): Promise<LotBadgePK>;
}
