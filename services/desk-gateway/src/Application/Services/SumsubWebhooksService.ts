import { Inject } from '@nestjs/common';

import { USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN } from '../InjectTokens';
import { IApplicantReviewed } from '../Interfaces';

export class SumsubWebhooksService {
  @Inject(USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN)
  private readonly userIdentityRPC: USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN;

  async applicantReviewed(payload: IApplicantReviewed): Promise<void> {
    const userId = payload.externalUserId;
    const isVerified = payload.reviewResult.reviewAnswer === 'GREEN';

    return this.userIdentityRPC.send('user.updateVerification', {
      userId,
      isVerified,
    });
  }
}
