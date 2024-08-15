import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { InjectContext } from '@packages/nestjs-request-context';
import { UserNotFoundError } from '@schema/common';
import { UserIdentitySchema } from '@schema/user-identity';
import { isBooleanSchema, isRequiredSchema, isStringWithValueSchema, validateRoot } from '@shared/validation';

import { UserPK } from '../../Domain';
import { UNIT_OF_WORK_INJECT_TOKEN, USER_REPOSITORY_INJECT_TOKEN } from '../InjectTokens';

type Payload = UserIdentitySchema.RPC.DTO.UserVerificationUpdate.Payload;
type Result = UserIdentitySchema.RPC.DTO.UserVerificationUpdate.Result;

export class UserVerificationUpdateCommand implements UseCase<Payload, Result> {
  @InjectContext(UNIT_OF_WORK_INJECT_TOKEN)
  private readonly uow: InjectContext<UNIT_OF_WORK_INJECT_TOKEN>;

  @InjectContext(USER_REPOSITORY_INJECT_TOKEN)
  private readonly userRepository: InjectContext<USER_REPOSITORY_INJECT_TOKEN>;

  async validate(payload: Payload) {
    validateRoot(payload, {
      userId: [isRequiredSchema, isStringWithValueSchema],
      isVerified: [isRequiredSchema, isBooleanSchema],
    });
  }

  async execute(payload: Payload): Promise<Result> {
    const uow = await this.uow();
    const userRepository = await this.userRepository();

    const userPK = UserPK.raw(payload.userId);

    const user = await userRepository.get(userPK);

    if (NullableObject.isEmpty(user)) throw new UserNotFoundError(payload.userId);

    user.updateVerification((verification) => verification.setIsVerified(payload.isVerified));

    userRepository.update(user);
    await uow.commit();
  }
}
