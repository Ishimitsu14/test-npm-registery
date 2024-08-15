import { MikroOrmRepository } from '@shared/db';

import { Bid, BidPK, IBidRepository } from '../../../../Domain';
import { CounterSnapshot } from '../Counter';
import { BidSnapshot } from './Snapshots';

export class BidRepository extends MikroOrmRepository<Bid, BidSnapshot> implements IBidRepository {
  readonly EntityType = Bid;
  readonly SnapshotType = BidSnapshot;

  async nextPK(): Promise<BidPK> {
    const id = await CounterSnapshot.generateIncrement('bid', this.em);
    return BidPK.fromSnapshot(id);
  }
}
