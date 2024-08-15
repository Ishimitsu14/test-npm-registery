import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { Query } from '@ddd/specifications';
import { Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { UserIdentitySchema } from '@schema/user-identity';
import { isRequiredSchema, isStringWithValueSchema, validateRoot } from '@shared/validation';

import {
  AuthGeneratedMessage,
  AuthSignedMessage,
  User,
  UserAuthData,
  UserByAddressSpecification,
  UserNickname,
  UserProfile,
  UserRole,
  UserRoleByUserSpecification,
  UserVerification,
} from '../../Domain';
import { EVM_AUTH_HELPER_INJECT_TOKEN, UNIT_OF_WORK_INJECT_TOKEN, USER_REPOSITORY_INJECT_TOKEN, USER_ROLE_REPOSITORY_INJECT_TOKEN } from '../InjectTokens';
import { UserResourceMapper } from '../ResourceMappers';

export type AuthSignInCommandProps = UserIdentitySchema.RPC.DTO.AuthSignIn.Payload;
export type AuthSignInCommandResult = UserIdentitySchema.RPC.DTO.AuthSignIn.Result;

export class AuthSignInCommand implements UseCase<AuthSignInCommandProps, AuthSignInCommandResult> {
  @InjectContext(UNIT_OF_WORK_INJECT_TOKEN)
  private readonly unitOfWork: InjectContext<UNIT_OF_WORK_INJECT_TOKEN>;

  @Inject(UserResourceMapper)
  private userResourceMapper: UserResourceMapper;

  @Inject(EVM_AUTH_HELPER_INJECT_TOKEN)
  private readonly evmAuthHelper: EVM_AUTH_HELPER_INJECT_TOKEN;

  @InjectContext(USER_REPOSITORY_INJECT_TOKEN)
  private readonly userRepository: InjectContext<USER_REPOSITORY_INJECT_TOKEN>;

  @InjectContext(USER_ROLE_REPOSITORY_INJECT_TOKEN)
  private readonly userRoleRepository: InjectContext<USER_ROLE_REPOSITORY_INJECT_TOKEN>;

  async validate(payload: AuthSignInCommandProps): Promise<any> {
    validateRoot(payload, {
      message: [isRequiredSchema, isStringWithValueSchema],
      signatureHash: [isRequiredSchema, isStringWithValueSchema],
      signature: [isRequiredSchema, isStringWithValueSchema],
    });
  }

  async execute(payload: AuthSignInCommandProps): Promise<AuthSignInCommandResult> {
    const userRepository = await this.userRepository();
    const userRoleRepository = await this.userRoleRepository();
    const unitOfWork = await this.unitOfWork();

    const authGeneratedMessage = await AuthGeneratedMessage.parse(this.evmAuthHelper, payload.message, payload.signatureHash);
    const authSignedMessage = await AuthSignedMessage.fromGeneratedMessage(this.evmAuthHelper, authGeneratedMessage, payload.signature);

    // TODO исправить регистр адресса, из-за него создаются дубли пользователей (которые уже зарегались)
    const publicAddress = authSignedMessage.message.address;
    const userFindByPublicAddressSpecification = new UserByAddressSpecification([publicAddress]);

    let user = await userRepository.first(Query.create(User).addSpecification(userFindByPublicAddressSpecification));
    if (NullableObject.isEmpty(user)) {
      const userPK = userRepository.nextIdentity();
      const userNicknameKey = UserNickname.raw(publicAddress.value);

      const authData = UserAuthData.create(publicAddress);
      const profile = UserProfile.createEmpty();
      const verification = UserVerification.raw(false);

      user = User.createNew(userPK, authData, userNicknameKey, profile, verification);
      userRepository.add(user);
    }

    await unitOfWork.commit();

    const userRoles = await userRoleRepository.find(Query.create(UserRole).addSpecification(new UserRoleByUserSpecification(user.primaryKey)));

    return this.userResourceMapper.toUser(user, userRoles.items);
  }
}
