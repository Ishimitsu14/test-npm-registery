import { Inject } from '@nestjs/common';
import { DeskGatewaySchema } from '@schema/desk-gateway';

import { useAuthApi } from '../Contexts';
import { FEEDBACK_RPC_COMPONENT_INJECT_TOKEN } from '../InjectTokens';

export class FeedbackService {
  @Inject(FEEDBACK_RPC_COMPONENT_INJECT_TOKEN)
  private readonly feedbackRPC: FEEDBACK_RPC_COMPONENT_INJECT_TOKEN;

  async create(payload: DeskGatewaySchema.FeedbackCreatePayload): Promise<DeskGatewaySchema.FeedbackCreateResult> {
    const { userId } = useAuthApi();
    await this.feedbackRPC.send('feedback.create', {
      text: payload.text,
      page: payload.page,
      rating: payload.rating,
      userPk: userId,
    });
  }
}
