import type { AuthTelegramSignInStatus } from '../../../Resource';

export type AuthTelegramCheckSignInPayload = {
    code: string;
  };
export type AuthTelegramCheckSignInResult = {
    status: AuthTelegramSignInStatus;
    token?: string | null;
  };
