import { AdminGatewaySchema } from '@schema/admin-gateway';

export class FeedbackResourceMapper {
  toFeedbackKey(item: AdminGatewaySchema.FeedbackPK): Required<AdminGatewaySchema.FeedbackPK> {
    return {
      resource: 'feedback_key',
      id: item.id,
    };
  }

  toFeedback(item: AdminGatewaySchema.Feedback): Required<AdminGatewaySchema.Feedback> {
    return {
      resource: 'feedback',
      id: item.id,
      text: item.text,
      page: item.page,
      rating: item.rating,
      userPk: item.userPk,
      createdAt: item.createdAt,
    };
  }
}
