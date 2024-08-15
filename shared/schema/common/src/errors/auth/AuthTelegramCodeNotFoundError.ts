import { RuntimeError } from '@ddd/errors';

export interface AuthTelegramCodeNotFoundErrorParams {
  code: string;
}

@RuntimeError.RegisterError('AuthTelegramCodeNotFoundError')
export class AuthTelegramCodeNotFoundError extends RuntimeError<AuthTelegramCodeNotFoundErrorParams> {
  constructor(code: string) {
    super('AuthTelegramCodeNotFoundError', { code });
  }

  get message(): string {
    return `Auth telegram code ${this.params.code} not found`;
  }
}
