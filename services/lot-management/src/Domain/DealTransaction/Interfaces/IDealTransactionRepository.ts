import { IRepository } from '@ddd/infra';
import { IQueryRepository } from '@ddd/specifications';

import { DealTransaction } from '../DealTransaction';
import { DealTransactionPK } from '../DealTransactionPK';

export interface IDealTransactionRepository extends IRepository<DealTransaction>, IQueryRepository<DealTransaction> {
  generatePK(): DealTransactionPK;
}
