import { UseCase } from '@ddd/application';
import { NullableObject, VoidableObject } from '@ddd/core';
import { Query } from '@ddd/specifications';
import { InjectContext } from '@packages/nestjs-request-context';
import { UserNotFoundError, UserProfileEmailIsNotUniqueError, UserProfileTelegramIsNotUniqueError } from '@schema/common';
import { UserIdentitySchema } from '@schema/user-identity';
import { Country, Email, Telegram } from '@shared/common-internal';
import { isRequiredSchema, isStringWithValueSchema, validateRoot } from '@shared/validation';

import { User, UserByProfileEmailSpecification, UserByProfileTelegramSpecification, UserPK } from '../../Domain';
import { UNIT_OF_WORK_INJECT_TOKEN, USER_REPOSITORY_INJECT_TOKEN } from '../InjectTokens';

export type UserProfileUpdateProps = UserIdentitySchema.RPC.DTO.UserProfileUpdate.Payload;
export type UserProfileUpdateResult = UserIdentitySchema.RPC.DTO.UserProfileUpdate.Result;

export class UserProfileUpdate implements UseCase<UserProfileUpdateProps, UserProfileUpdateResult> {
  @InjectContext(UNIT_OF_WORK_INJECT_TOKEN)
  private readonly uow: InjectContext<UNIT_OF_WORK_INJECT_TOKEN>;

  @InjectContext(USER_REPOSITORY_INJECT_TOKEN)
  private readonly userRepository: InjectContext<USER_REPOSITORY_INJECT_TOKEN>;

  async validate(payload: UserProfileUpdateProps) {
    validateRoot(payload, {
      userId: [isRequiredSchema, isStringWithValueSchema],
      firstName: [isStringWithValueSchema],
      lastName: [isStringWithValueSchema],
      telegram: [isStringWithValueSchema],
      email: [isStringWithValueSchema],
      location: [Country.validator()],
    });
  }

  async execute(payload: UserProfileUpdateProps): Promise<UserProfileUpdateResult> {
    const uow = await this.uow();
    const userRepository = await this.userRepository();

    const userPK = UserPK.raw(payload.userId);

    const user = await userRepository.get(userPK);

    if (NullableObject.isEmpty(user)) throw new UserNotFoundError(payload.userId);

    if (VoidableObject.hasValue(payload.firstName)) {
      user.updateProfile((profile) => profile.setFirstName(NullableObject(payload.firstName)));
    }

    if (VoidableObject.hasValue(payload.lastName)) {
      user.updateProfile((profile) => profile.setLastName(NullableObject(payload.lastName)));
    }

    if (VoidableObject.hasValue(payload.telegram)) {
      const telegram = NullableObject.map(payload.telegram, (telegram) => Telegram.raw(telegram));
      if (NullableObject.isEmpty(telegram)) {
        user.updateProfile((profile) => profile.setTelegram(NullableObject));
      } else {
        const query = Query.create(User).addSpecification(new UserByProfileTelegramSpecification(telegram));

        const usersWithTelegramCount = await userRepository.count(query);

        if (usersWithTelegramCount > 0) throw new UserProfileTelegramIsNotUniqueError(payload.userId, payload.telegram);

        user.updateProfile((profile) => profile.setTelegram(telegram));
      }
    }

    if (VoidableObject.hasValue(payload.email)) {
      const email = NullableObject.map(payload.email, (email) => Email.raw(email));
      if (NullableObject.isEmpty(email)) {
        user.updateProfile((profile) => profile.setEmail(NullableObject));
      } else {
        const query = Query.create(User).addSpecification(new UserByProfileEmailSpecification(email));

        const usersWithEmailCount = await userRepository.count(query);

        if (usersWithEmailCount > 0) throw new UserProfileEmailIsNotUniqueError(payload.userId, payload.email);

        user.updateProfile((profile) => profile.setEmail(email));
      }
    }

    if (VoidableObject.hasValue(payload.location)) {
      user.updateProfile((profile) => profile.setLocation(NullableObject(Country.getById(payload.location))));
    }

    userRepository.update(user);
    await uow.commit();
  }
}
