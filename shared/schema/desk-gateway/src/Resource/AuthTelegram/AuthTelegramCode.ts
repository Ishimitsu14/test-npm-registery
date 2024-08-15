import { CoreSchema } from '@schema/core';

import { AuthTelegramCodeKey } from './AuthTelegramCodeKey';

export interface AuthTelegramCode extends CoreSchema.Resource<'auth_telegram_code', AuthTelegramCodeKey> {
  expiresAt: number;
  isExpired: boolean;
}
