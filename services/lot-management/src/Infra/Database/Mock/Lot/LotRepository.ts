import { Inject } from '@nestjs/common';
import { MockRepository } from '@shared/db';

import { BID_REPOSITORY_INJECT_TOKEN, DEAL_REPOSITORY_INJECT_TOKEN, DEAL_TRANSACTION_REPOSITORY_INJECT_TOKEN } from '../../../../Application';
import { ILotRepository, Lot, LotPK } from '../../../../Domain';

let id = 0;

export class LotRepository extends MockRepository<Lot> implements ILotRepository {
  @Inject(BID_REPOSITORY_INJECT_TOKEN)
  private bidRepository: BID_REPOSITORY_INJECT_TOKEN;

  @Inject(DEAL_REPOSITORY_INJECT_TOKEN)
  private dealRepository: DEAL_REPOSITORY_INJECT_TOKEN;

  @Inject(DEAL_TRANSACTION_REPOSITORY_INJECT_TOKEN)
  private dealTransactionRepository: DEAL_TRANSACTION_REPOSITORY_INJECT_TOKEN;

  readonly EntityType = Lot;

  async nextPK(): Promise<LotPK> {
    return new LotPK(++id);
  }
}
