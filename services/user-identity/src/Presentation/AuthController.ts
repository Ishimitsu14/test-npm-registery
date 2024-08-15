import { Inject } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { NestRpcController, NestRpcMethod, useRpcRequestInfo } from '@packages/nestjs-rpc-server';
import { UserIdentitySchema } from '@schema/user-identity';

import { AuthGenerateMessageCommand, AuthGenerateTelegramCodeCommand, AuthSignInCommand, AuthSignInWithTelegramCommand, AuthTelegramCodeByKeyQuery } from '../Application';
import { AuthTelegramVerifyWebAppCommand } from '../Application/CQRS/AuthTelegramVerifyWebAppCommand';
import { AuthValidateUserByTelegramCodeCommand } from '../Application/CQRS/AuthValidateUserByTelegramCodeCommand';

@NestRpcController({})
export class AuthController {
  @Inject(ModuleRef)
  private moduleRef: ModuleRef;

  @NestRpcMethod(UserIdentitySchema.RPC.MethodName('auth.generateMessage'))
  async generateMessage() {
    const { params } = useRpcRequestInfo();
    return this.moduleRef.get(AuthGenerateMessageCommand).execute(params);
  }

  @NestRpcMethod(UserIdentitySchema.RPC.MethodName('auth.generateTelegramCode'))
  async generateTelegramCode() {
    const { params } = useRpcRequestInfo();
    return this.moduleRef.get(AuthGenerateTelegramCodeCommand).execute(params);
  }

  @NestRpcMethod(UserIdentitySchema.RPC.MethodName('auth.telegramCodeByKey'))
  async telegramCodeGetByKey() {
    const handler = this.moduleRef.get(AuthTelegramCodeByKeyQuery);
    const { params } = useRpcRequestInfo();

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(UserIdentitySchema.RPC.MethodName('auth.telegramVerifyWebApp'))
  async telegramVerifyWebApp() {
    const handler = this.moduleRef.get(AuthTelegramVerifyWebAppCommand);
    const { params } = useRpcRequestInfo();

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(UserIdentitySchema.RPC.MethodName('auth.validateUserByTelegramCode'))
  async validateTelegramCode() {
    const handler = this.moduleRef.get(AuthValidateUserByTelegramCodeCommand);
    const { params } = useRpcRequestInfo();

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(UserIdentitySchema.RPC.MethodName('auth.signIn'))
  async signIn() {
    const { params } = useRpcRequestInfo();
    return this.moduleRef.get(AuthSignInCommand).execute(params);
  }

  @NestRpcMethod(UserIdentitySchema.RPC.MethodName('auth.signInWithTelegram'))
  async signInWithTelegram() {
    const handler = this.moduleRef.get(AuthSignInWithTelegramCommand);
    const { params } = useRpcRequestInfo();

    await handler.validate(params);
    return handler.execute(params);
  }
}
