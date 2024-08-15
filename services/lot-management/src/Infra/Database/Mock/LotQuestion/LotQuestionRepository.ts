import { MockRepository } from '@shared/db';
import { v4 } from 'uuid';

import { ILotQuestionRepository, LotQuestion, LotQuestionPK } from '../../../../Domain';

export class LotQuestionRepository extends MockRepository<LotQuestion> implements ILotQuestionRepository {
  readonly EntityType = LotQuestion;

  async nextPK(): Promise<LotQuestionPK> {
    return LotQuestionPK.raw(v4());
  }
}
