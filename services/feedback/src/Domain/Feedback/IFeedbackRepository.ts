import { IRepository } from '@ddd/infra';
import { IQueryRepository } from '@ddd/specifications';

import { Feedback } from './Feedback';
import { FeedbackPK } from './FeedbackPK';

export interface IFeedbackRepository extends IRepository<Feedback>, IQueryRepository<Feedback> {
  nextIdentity(): FeedbackPK;
}
