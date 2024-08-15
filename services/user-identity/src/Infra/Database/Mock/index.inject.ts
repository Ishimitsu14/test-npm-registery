import { ModuleMetadata } from '@nestjs/common';
import { mockInject } from '@shared/db';

import { AUTH_TELEGRAM_CODE_INJECT_PROVIDERS } from './AuthTelegram';
import { USER_INJECT_PROVIDERS } from './User';
import { USER_ROLE_INJECT_PROVIDERS } from './UserRole';

export const MOCK_INJECT_PROVIDERS: ModuleMetadata['providers'] = [...mockInject(), ...USER_INJECT_PROVIDERS, ...USER_ROLE_INJECT_PROVIDERS, ...AUTH_TELEGRAM_CODE_INJECT_PROVIDERS];
