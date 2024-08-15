import { MockRepository } from '@shared/db';

import { Bid, BidPK, IBidRepository } from '../../../../Domain';

let id = 0;

export class BidRepository extends MockRepository<Bid> implements IBidRepository {
  readonly EntityType = Bid;

  async nextPK(): Promise<BidPK> {
    return new BidPK(++id);
  }
}
