import { Inject } from '@nestjs/common';
import { AdminGatewaySchema } from '@schema/admin-gateway';

import { FEEDBACK_RPC_COMPONENT_INJECT_TOKEN } from '../InjectTokens';
import { CoreResourceMapper, FeedbackResourceMapper } from '../ResourceMapper';

export class FeedbackService {
  @Inject(FEEDBACK_RPC_COMPONENT_INJECT_TOKEN)
  private readonly feedbackRPC: FEEDBACK_RPC_COMPONENT_INJECT_TOKEN;

  @Inject(FeedbackResourceMapper)
  private feedbackResourceMapper: FeedbackResourceMapper;

  @Inject(CoreResourceMapper)
  private coreResourceMapper: CoreResourceMapper;

  async getById(payload: AdminGatewaySchema.FeedbackGetByIdPayload): Promise<AdminGatewaySchema.FeedbackGetByIdResult> {
    const feedback = await this.feedbackRPC.send('feedback.getById', {
      id: payload.id,
    });

    return feedback;
  }

  async list(payload: AdminGatewaySchema.FeedbackListPayload): Promise<AdminGatewaySchema.FeedbackListResult> {
    const feedbackList = await this.feedbackRPC.send('feedback.list', {});

    return this.coreResourceMapper.toPagination(feedbackList, this.feedbackResourceMapper.toFeedback);
  }
}
