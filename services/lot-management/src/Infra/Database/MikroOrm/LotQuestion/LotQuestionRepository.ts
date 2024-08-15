import { MikroOrmRepository } from '@shared/db';
import { v4 } from 'uuid';

import { ILotQuestionRepository, LotQuestion, LotQuestionPK } from '../../../../Domain';
import { LotQuestionSnapshot } from './Snapshots';

export class LotQuestionRepository extends MikroOrmRepository<LotQuestion, LotQuestionSnapshot> implements ILotQuestionRepository {
  readonly EntityType = LotQuestion;
  readonly SnapshotType = LotQuestionSnapshot;

  async nextPK(): Promise<LotQuestionPK> {
    return LotQuestionPK.raw(v4());
  }
}
