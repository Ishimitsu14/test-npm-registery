import { UseCase } from '@ddd/application';
import { Inject } from '@nestjs/common';
import { UserIdentitySchema } from '@schema/user-identity';
import { EvmPublicAddress } from '@shared/common-internal';
import { isRequiredSchema, isStringWithValueSchema, validateRoot } from '@shared/validation';

import { AuthGeneratedMessage } from '../../Domain';
import { URI } from '../../Domain/Auth/URI';
import { URIDomain } from '../../Domain/Auth/URIDomain';
import { EVM_AUTH_HELPER_INJECT_TOKEN } from '../InjectTokens';
import { AuthResourceMapper } from '../ResourceMappers';

export type AuthGenerateMessageCommandProps = UserIdentitySchema.RPC.DTO.AuthGenerateMessage.Payload;
export type AuthGenerateMessageCommandResult = UserIdentitySchema.RPC.DTO.AuthGenerateMessage.Result;

export class AuthGenerateMessageCommand implements UseCase<AuthGenerateMessageCommandProps, AuthGenerateMessageCommandResult> {
  @Inject(EVM_AUTH_HELPER_INJECT_TOKEN)
  private readonly evmAuthHelper: EVM_AUTH_HELPER_INJECT_TOKEN;

  @Inject(AuthResourceMapper)
  private authResourceMapper: AuthResourceMapper;

  async validate(payload: AuthGenerateMessageCommandProps): Promise<any> {
    validateRoot(payload, {
      domain: [isRequiredSchema, isStringWithValueSchema],
      uri: [isRequiredSchema, isStringWithValueSchema],
      address: [isRequiredSchema, EvmPublicAddress.validator],
    });
  }

  async execute(payload: AuthGenerateMessageCommandProps): Promise<AuthGenerateMessageCommandResult> {
    const uriDomain = URIDomain.raw(payload.domain);
    const uri = URI.raw(payload.uri);
    const address = EvmPublicAddress.raw(payload.address);
    const generatedMessage = AuthGeneratedMessage.generate(this.evmAuthHelper, uriDomain, uri, address);

    return this.authResourceMapper.toAuthGeneratedMessage(this.evmAuthHelper, generatedMessage);
  }
}
