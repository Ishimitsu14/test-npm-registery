import { Inject } from '@nestjs/common';
import { DeskGatewaySchema } from '@schema/desk-gateway';

import { useAuthApi } from '../Contexts';
import { USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN } from '../InjectTokens';

export class SumsubService {
  @Inject(USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN)
  private readonly userIdentityRPC: USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN;

  async generateVerificationLink(payload: DeskGatewaySchema.RPC.DTO.SumsubGenerateVerificationLink.Payload): Promise<DeskGatewaySchema.RPC.DTO.SumsubGenerateVerificationLink.Result> {
    const { userId } = useAuthApi();

    return this.userIdentityRPC.send('sumsub.generateVerificationLink', {
      userId,
    });
  }
}
