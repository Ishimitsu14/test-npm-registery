import { Inject } from '@nestjs/common';
import { DeskGatewaySchema } from '@schema/desk-gateway';
import { UserIdentitySchema } from '@schema/user-identity';

import { UserResourceMapper } from './UserResourceMapper';

export class AuthResourceMapper {
  @Inject(UserResourceMapper)
  private userResourceMapper: UserResourceMapper;

  toAuthGeneratedMessage(item: UserIdentitySchema.AuthGeneratedMessage): Required<DeskGatewaySchema.AuthGeneratedMessage> {
    return {
      resource: 'auth_generated_message',
      address: item.address,
      message: item.message,
      signatureHash: item.signature_hash,
    };
  }

  toAuthTelegramCode(domain: UserIdentitySchema.AuthTelegramCode): Required<DeskGatewaySchema.AuthTelegramCode> {
    return {
      resource: 'auth_telegram_code',
      code: domain.code,
      expiresAt: domain.expiresAt.valueOf(),
      isExpired: domain.isExpired,
    };
  }
}
