import { Inject } from '@nestjs/common';
import { AdminGatewaySchema } from '@schema/admin-gateway';
import { UserIdentitySchema } from '@schema/user-identity';

import { UserResourceMapper } from './UserResourceMapper';

export class AuthResourceMapper {
  @Inject(UserResourceMapper)
  private userResourceMapper: UserResourceMapper;

  toAuthGeneratedMessage(item: UserIdentitySchema.AuthGeneratedMessage): Required<AdminGatewaySchema.AuthGeneratedMessage> {
    return {
      resource: 'auth_generated_message',
      address: item.address,
      message: item.message,
      signatureHash: item.signature_hash,
    };
  }
}
