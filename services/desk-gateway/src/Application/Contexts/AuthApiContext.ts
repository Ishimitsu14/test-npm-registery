import { Context, useContext } from '@packages/berish-context';

export interface AuthApi {
  token: string | null;
  userId: string | null;

  isAuthorized: boolean;
  ensureIsAuthorized(): void;
}

export const AuthApiContext = new Context<AuthApi>();

export function useAuthApi() {
  return useContext(AuthApiContext);
}
