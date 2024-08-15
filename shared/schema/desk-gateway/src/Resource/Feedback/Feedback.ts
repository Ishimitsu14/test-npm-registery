import { CoreSchema } from '@schema/core';

import { FeedbackPK } from './FeedbackPK';

export interface Feedback extends CoreSchema.Resource<'feedback', FeedbackPK> {
  text: string;
  page: string;
  rating: number;
  userPk: string;
}
