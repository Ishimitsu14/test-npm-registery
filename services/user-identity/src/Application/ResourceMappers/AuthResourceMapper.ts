import { NullableObject } from '@ddd/core';
import { Inject } from '@nestjs/common';
import { UserIdentitySchema } from '@schema/user-identity';

import { AuthGeneratedMessage, AuthTelegramCode, IEvmAuthHelper } from '../../Domain';
import { UserResourceMapper } from './UserResourceMapper';

export class AuthResourceMapper {
  @Inject(UserResourceMapper)
  private userResourceMapper: UserResourceMapper;

  toAuthGeneratedMessage(helper: IEvmAuthHelper, domain: AuthGeneratedMessage): UserIdentitySchema.AuthGeneratedMessage {
    return {
      resource: 'auth_generated_message',
      address: domain.address.value,
      signature_hash: domain.signatureHash,
      message: domain.toSiweMessageStringify(helper),
    };
  }

  toAuthTelegramCode(domain: AuthTelegramCode): UserIdentitySchema.AuthTelegramCode {
    return {
      resource: 'auth_telegram_code',
      code: domain.primaryKey.code,
      expiresAt: domain.expiresAt.valueOf(),
      isExpired: domain.isExpired,
      userPK: NullableObject.mapUndefined(domain.userPK, (v) => v.id),
    };
  }
}
