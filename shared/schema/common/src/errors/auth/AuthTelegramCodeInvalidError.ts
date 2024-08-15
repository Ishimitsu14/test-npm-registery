import { RuntimeError } from '@ddd/errors';

@RuntimeError.RegisterError('AuthTelegramCodeInvalidError')
export class AuthTelegramCodeInvalidError extends RuntimeError {
  constructor() {
    super('AuthTelegramCodeInvalidError', {});
  }

  get message(): string {
    return `Received telegram auth code is not valid`;
  }
}
