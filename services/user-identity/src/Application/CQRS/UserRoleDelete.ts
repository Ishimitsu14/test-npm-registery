import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { InjectContext } from '@packages/nestjs-request-context';
import { UserRoleNotFoundError } from '@schema/common';
import { UserIdentitySchema } from '@schema/user-identity';
import { isRequiredSchema, isStringWithValueSchema, validateRoot } from '@shared/validation';

import { UserRolePK } from '../../Domain';
import { UNIT_OF_WORK_INJECT_TOKEN, USER_REPOSITORY_INJECT_TOKEN, USER_ROLE_REPOSITORY_INJECT_TOKEN } from '../InjectTokens';

export type UserRoleDeleteProps = UserIdentitySchema.RPC.DTO.UserRoleDelete.Payload;
export type UserRoleDeleteResult = UserIdentitySchema.RPC.DTO.UserRoleDelete.Result;

export class UserRoleDelete implements UseCase<UserRoleDeleteProps, UserRoleDeleteResult> {
  @InjectContext(UNIT_OF_WORK_INJECT_TOKEN)
  private readonly uow: InjectContext<UNIT_OF_WORK_INJECT_TOKEN>;

  @InjectContext(USER_REPOSITORY_INJECT_TOKEN)
  private readonly userRepository: InjectContext<USER_REPOSITORY_INJECT_TOKEN>;

  @InjectContext(USER_ROLE_REPOSITORY_INJECT_TOKEN)
  private readonly userRoleRepository: InjectContext<USER_ROLE_REPOSITORY_INJECT_TOKEN>;

  async validate(payload: UserRoleDeleteProps) {
    validateRoot(payload, {
      roleId: [isRequiredSchema, isStringWithValueSchema],
    });
  }

  async execute(payload: UserRoleDeleteProps): Promise<UserRoleDeleteResult> {
    const uow = await this.uow();
    const userRoleRepository = await this.userRoleRepository();

    const rolePK = UserRolePK.raw(payload.roleId);

    const role = await userRoleRepository.get(rolePK);

    if (NullableObject.isEmpty(role)) throw new UserRoleNotFoundError(payload.roleId);

    userRoleRepository.removeByPK(rolePK);

    await uow.commit();
  }
}
