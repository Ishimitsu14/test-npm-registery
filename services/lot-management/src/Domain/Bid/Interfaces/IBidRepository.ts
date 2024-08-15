import { IRepository } from '@ddd/infra';
import { IQueryRepository } from '@ddd/specifications';

import { Bid } from '../Bid';
import { BidPK } from '../BidPK';

export interface IBidRepository extends IRepository<Bid>, IQueryRepository<Bid> {
  nextPK(): Promise<BidPK>;
}
