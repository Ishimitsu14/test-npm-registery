import { FeedbackSchema } from '@schema/feedback';

import { Feedback } from '../../Domain';

export class FeedbackResourceMapper {
  toFeedbackPK(feedback: Feedback): Required<FeedbackSchema.FeedbackPK> {
    return {
      resource: 'feedback_key',
      id: feedback.primaryKey.id,
    };
  }

  toFeedback(feedback: Feedback): Required<FeedbackSchema.Feedback> {
    return {
      resource: 'feedback',
      id: feedback.primaryKey.id,
      text: feedback.text,
      page: feedback.page,
      rating: feedback.rating,
      userPk: feedback.userPk,
      createdAt: +feedback.createdAt,
    };
  }
}
