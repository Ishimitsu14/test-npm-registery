import { IRepository } from '@ddd/infra';
import { IQueryRepository } from '@ddd/specifications';

import { LotQuestion } from '../LotQuestion';
import { LotQuestionPK } from '../LotQuestionPK';

export interface ILotQuestionRepository extends IRepository<LotQuestion>, IQueryRepository<LotQuestion> {
  nextPK(): Promise<LotQuestionPK>;
}
