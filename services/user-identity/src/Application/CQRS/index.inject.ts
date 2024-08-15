import { ModuleMetadata } from '@nestjs/common';

import { AuthGenerateMessageCommand } from './AuthGenerateMessageCommand';
import { AuthGenerateTelegramCodeCommand } from './AuthGenerateTelegramCodeCommand';
import { AuthSignInCommand } from './AuthSignInCommand';
import { AuthSignInWithTelegramCommand } from './AuthSignInWithTelegramCommand';
import { AuthTelegramCodeByKeyQuery } from './AuthTelegramCodeByKeyQuery';
import { AuthTelegramVerifyWebAppCommand } from './AuthTelegramVerifyWebAppCommand';
import { AuthValidateUserByTelegramCodeCommand } from './AuthValidateUserByTelegramCodeCommand';
import { SumsubGenerateVerificationLinkCommand } from './SumsubGenerateVerificationLinkCommand';
import { UserGetByKeyQuery } from './UserGetByKeyQuery';
import { UserListQuery } from './UserListQuery';
import { UserProfileUpdate } from './UserProfileUpdate';
import { UserRoleCreate } from './UserRoleCreate';
import { UserRoleDelete } from './UserRoleDelete';
import { UserVerificationUpdateCommand } from './UserVerificationUpdateCommand';

export const CQRS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  AuthSignInCommand,
  AuthValidateUserByTelegramCodeCommand,
  AuthSignInWithTelegramCommand,
  AuthGenerateMessageCommand,
  AuthTelegramCodeByKeyQuery,
  UserGetByKeyQuery,
  UserListQuery,
  UserProfileUpdate,
  UserRoleCreate,
  UserRoleDelete,
  AuthGenerateTelegramCodeCommand,
  AuthTelegramVerifyWebAppCommand,
  SumsubGenerateVerificationLinkCommand,
  UserVerificationUpdateCommand,
];
