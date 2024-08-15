import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { Query } from '@ddd/specifications';
import { InjectContext } from '@packages/nestjs-request-context';
import { UserNotFoundError, UserRoleUserAlreadyHasRole } from '@schema/common';
import { UserIdentitySchema } from '@schema/user-identity';
import { isEnumSchema, isRequiredSchema, isStringWithValueSchema, validateRoot } from '@shared/validation';

import { UserPK, UserRole, UserRoleByTypeSpecification, UserRoleByUserSpecification, UserRoleType } from '../../Domain';
import { UNIT_OF_WORK_INJECT_TOKEN, USER_REPOSITORY_INJECT_TOKEN, USER_ROLE_REPOSITORY_INJECT_TOKEN } from '../InjectTokens';

export type UserRoleCreateProps = UserIdentitySchema.RPC.DTO.UserRoleCreate.Payload;
export type UserRoleCreateResult = UserIdentitySchema.RPC.DTO.UserRoleCreate.Result;

export class UserRoleCreate implements UseCase<UserRoleCreateProps, UserRoleCreateResult> {
  @InjectContext(UNIT_OF_WORK_INJECT_TOKEN)
  private readonly uow: InjectContext<UNIT_OF_WORK_INJECT_TOKEN>;

  @InjectContext(USER_REPOSITORY_INJECT_TOKEN)
  private readonly userRepository: InjectContext<USER_REPOSITORY_INJECT_TOKEN>;

  @InjectContext(USER_ROLE_REPOSITORY_INJECT_TOKEN)
  private readonly userRoleRepository: InjectContext<USER_ROLE_REPOSITORY_INJECT_TOKEN>;

  async validate(payload: UserRoleCreateProps) {
    validateRoot(payload, {
      userId: [isRequiredSchema, isStringWithValueSchema],
      type: [isRequiredSchema, isEnumSchema(UserIdentitySchema.UserRoleType)],
    });
  }

  async execute(payload: UserRoleCreateProps): Promise<UserRoleCreateResult> {
    const uow = await this.uow();
    const userRepository = await this.userRepository();
    const userRoleRepository = await this.userRoleRepository();

    const userPK = UserPK.raw(payload.userId);

    const user = await userRepository.get(userPK);

    if (NullableObject.isEmpty(user)) throw new UserNotFoundError(payload.userId);

    const query = Query.create(UserRole)
      .addSpecification(new UserRoleByUserSpecification(userPK))
      .addSpecification(new UserRoleByTypeSpecification(UserRoleType.getById(payload.type)));

    const alreadyHasRole = await userRoleRepository.count(query);

    if (alreadyHasRole) throw new UserRoleUserAlreadyHasRole(payload.userId, payload.type);

    const rolePK = await userRoleRepository.nextPK();

    const role = UserRole.createNew(rolePK, user.primaryKey, UserRoleType.getById(payload.type));

    userRoleRepository.add(role);

    await uow.commit();
  }
}
