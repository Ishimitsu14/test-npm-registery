import { MikroOrmRepository } from '@shared/db';
import { v4 } from 'uuid';

import { Feedback, FeedbackPK, IFeedbackRepository } from '../../../../Domain';
import { FeedbackSnapshot } from './Snapshots';

export class FeedbackRepository extends MikroOrmRepository<Feedback, FeedbackSnapshot> implements IFeedbackRepository {
  readonly EntityType = Feedback;
  readonly SnapshotType = FeedbackSnapshot;

  nextIdentity(): FeedbackPK {
    return FeedbackPK.raw(v4());
  }
}
