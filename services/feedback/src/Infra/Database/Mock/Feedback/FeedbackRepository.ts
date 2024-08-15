import { MockRepository } from '@shared/db';
import { v4 } from 'uuid';

import { Feedback, FeedbackPK, IFeedbackRepository } from '../../../../Domain';

export class FeedbackRepository extends MockRepository<Feedback> implements IFeedbackRepository {
  readonly EntityType = Feedback;

  nextIdentity(): FeedbackPK {
    return FeedbackPK.raw(v4());
  }
}
