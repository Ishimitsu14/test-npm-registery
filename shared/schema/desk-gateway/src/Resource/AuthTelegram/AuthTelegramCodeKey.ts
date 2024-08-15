import { CoreSchema } from '@schema/core';

export interface AuthTelegramCodeKey extends CoreSchema.ResourceKey<'auth_telegram_code'> {
  code: string;
}
