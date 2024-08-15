import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { Query, WhereInPKSpecification } from '@ddd/specifications';
import { Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { UserNotFoundError } from '@schema/common';
import { UserIdentitySchema } from '@schema/user-identity';
import { isRequiredSchema, isStringWithValueSchema, orSchema, Schema, validateRoot } from '@shared/validation';

import { User, UserByNicknameSpecification, UserNickname, UserPK, UserRole, UserRoleByUserSpecification } from '../../Domain';
import { USER_REPOSITORY_INJECT_TOKEN, USER_ROLE_REPOSITORY_INJECT_TOKEN } from '../InjectTokens';
import { UserResourceMapper } from '../ResourceMappers';

export type UserGetByKeyQueryProps = UserIdentitySchema.RPC.DTO.UserGetByKey.Payload;
export type UserGetByKeyQueryResult = UserIdentitySchema.RPC.DTO.UserGetByKey.Result;

export class UserGetByKeyQuery implements UseCase<UserGetByKeyQueryProps, UserGetByKeyQueryResult> {
  @Inject(UserResourceMapper)
  private userResourceMapper: UserResourceMapper;

  @InjectContext(USER_REPOSITORY_INJECT_TOKEN)
  private readonly userRepository: InjectContext<USER_REPOSITORY_INJECT_TOKEN>;

  @InjectContext(USER_ROLE_REPOSITORY_INJECT_TOKEN)
  private readonly userRoleRepository: InjectContext<USER_ROLE_REPOSITORY_INJECT_TOKEN>;

  readonly schema: Schema<UserGetByKeyQueryProps> = [
    orSchema([
      { id: [isRequiredSchema], nickname: [] },
      { id: [], nickname: [isRequiredSchema] },
    ]),
    {
      id: [isStringWithValueSchema],
      nickname: [isStringWithValueSchema],
    },
  ];

  async validate(payload: UserGetByKeyQueryProps): Promise<any> {
    validateRoot(payload, this.schema);
    // if (!payload.id && !payload.nickname) {
    //   validateRoot(payload, {
    //     id: [isRequiredSchema, isStringWithValueSchema],
    //     nickname: [isStringWithValueSchema],
    //   });
    // } else {
    //   validateRoot(payload, {
    //     id: [isStringWithValueSchema],
    //     nickname: [isStringWithValueSchema],
    //   });
    // }

    // if ([payload.id, payload.nickname].every((m) => NullableObject.isEmpty(m))) {
    //   validateRoot(payload, {
    //     id: [isRequiredSchema, isStringWithValueSchema],
    //     nickname: [isStringWithValueSchema],
    //   });
    // }
  }

  async execute(payload: UserGetByKeyQueryProps): Promise<UserGetByKeyQueryResult> {
    const userRepository = await this.userRepository();
    const userRoleRepository = await this.userRoleRepository();

    let query = Query.create(User);

    if (NullableObject.hasValue(payload.nickname)) {
      query = query.addSpecification(new UserByNicknameSpecification(UserNickname.raw(payload.nickname)));
    }

    if (NullableObject.hasValue(payload.id)) {
      query = query.addSpecification(WhereInPKSpecification.create(UserPK.raw(payload.id)));
    }

    const user = await userRepository.first(query);
    if (NullableObject.isEmpty(user)) throw new UserNotFoundError(payload.id || payload.nickname);

    const userRoles = await userRoleRepository.find(Query.create(UserRole).addSpecification(new UserRoleByUserSpecification(user.primaryKey)));

    return this.userResourceMapper.toUser(user, userRoles.items);
  }
}
