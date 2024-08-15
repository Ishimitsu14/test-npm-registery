import { ModuleMetadata, Scope } from '@nestjs/common';

import { AUTH_TELEGRAM_CODE_REPOSITORY_INJECT_TOKEN } from '../../../../Application';
import { AuthTelegramCodeRepository } from './AuthTelegramCodeRepository';
import { SPECIFICATION_RESOLVERS_INJECT_PROVIDERS } from './SpecificationResolvers';

export const AUTH_TELEGRAM_CODE_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  ...SPECIFICATION_RESOLVERS_INJECT_PROVIDERS,
  {
    provide: AuthTelegramCodeRepository,
    useClass: AuthTelegramCodeRepository,
    scope: Scope.REQUEST,
  },
  {
    provide: AUTH_TELEGRAM_CODE_REPOSITORY_INJECT_TOKEN,
    useExisting: AuthTelegramCodeRepository,
    scope: Scope.REQUEST,
  },
];
