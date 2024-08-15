import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { UserNotFoundError } from '@schema/common';
import { UserIdentitySchema } from '@schema/user-identity';
import { UserIdentityConfig } from '@shared/config';
import { isRequiredSchema, isStringWithValueSchema, validateRoot } from '@shared/validation';
import axios from 'axios';

import { UserPK } from '../../Domain';
import { SUMSUB_AUTH_HELPER_INJECT_TOKEN, USER_REPOSITORY_INJECT_TOKEN } from '../InjectTokens';

type Payload = UserIdentitySchema.RPC.DTO.SumsubGenerateVerificationLink.Payload;
type Result = UserIdentitySchema.RPC.DTO.SumsubGenerateVerificationLink.Result;

export class SumsubGenerateVerificationLinkCommand implements UseCase<Payload, Result> {
  @InjectContext(USER_REPOSITORY_INJECT_TOKEN)
  private readonly userRepository: InjectContext<USER_REPOSITORY_INJECT_TOKEN>;

  @Inject(SUMSUB_AUTH_HELPER_INJECT_TOKEN)
  private readonly sumsubAuthHelper: SUMSUB_AUTH_HELPER_INJECT_TOKEN;

  async validate(payload: Payload) {
    validateRoot(payload, {
      userId: [isRequiredSchema, isStringWithValueSchema],
    });
  }

  async execute(payload: Payload): Promise<Result> {
    const userRepository = await this.userRepository();

    const userPK = UserPK.raw(payload.userId);

    const user = await userRepository.get(userPK);

    if (NullableObject.isEmpty(user)) throw new UserNotFoundError(payload.userId);

    const timestamp = this.sumsubAuthHelper.generateTimestamp();
    const url = this.generateWebsdkRequestUrl();
    const body = { externalUserId: payload.userId };
    const signature = this.sumsubAuthHelper.generateSignature({ url, timestamp, method: 'POST', body });
    const headers = this.sumsubAuthHelper.buildHeaders({ signature, timestamp });

    const { data } = await axios.post<{ url: string }>(url, body, { headers });

    return data;
  }

  generateWebsdkRequestUrl(): string {
    const { apiUrl, verificationLevel } = UserIdentityConfig.sumsub;

    return `${apiUrl}/resources/sdkIntegrations/levels/${verificationLevel}/websdkLink`;
  }
}
