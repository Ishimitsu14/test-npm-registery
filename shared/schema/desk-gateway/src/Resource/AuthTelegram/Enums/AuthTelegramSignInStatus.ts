export const AuthTelegramSignInStatus = ['Pending', 'Success'] as const;
export type AuthTelegramSignInStatus = (typeof AuthTelegramSignInStatus)[number];
