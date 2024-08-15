import { Inject } from '@nestjs/common';
import { MikroOrmRepository } from '@shared/db';

import { BID_REPOSITORY_INJECT_TOKEN, DEAL_REPOSITORY_INJECT_TOKEN, DEAL_TRANSACTION_REPOSITORY_INJECT_TOKEN } from '../../../../Application';
import { ILotRepository, Lot, LotPK } from '../../../../Domain';
import { CounterSnapshot } from '../Counter';
import { LotSnapshot } from './Snapshots';

export class LotRepository extends MikroOrmRepository<Lot, LotSnapshot> implements ILotRepository {
  readonly EntityType = Lot;
  readonly SnapshotType = LotSnapshot;

  @Inject(BID_REPOSITORY_INJECT_TOKEN)
  private bidRepository: BID_REPOSITORY_INJECT_TOKEN;

  @Inject(DEAL_REPOSITORY_INJECT_TOKEN)
  private dealRepository: DEAL_REPOSITORY_INJECT_TOKEN;

  @Inject(DEAL_TRANSACTION_REPOSITORY_INJECT_TOKEN)
  private dealTransactionRepository: DEAL_TRANSACTION_REPOSITORY_INJECT_TOKEN;

  async nextPK(): Promise<LotPK> {
    const id = await CounterSnapshot.generateIncrement('lot', this.em);
    return new LotPK(id);
  }
}
