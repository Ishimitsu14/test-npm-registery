export type AuthGenerateTelegramCodePayload = {};
export type AuthGenerateTelegramCodeResult = {
    code: string;
    expiresAt: number;
    isExpired: boolean;
  };
