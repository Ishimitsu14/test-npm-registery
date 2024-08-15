import { RuntimeError } from '@ddd/errors';

@RuntimeError.RegisterError('AuthTelegramCodeIsExpiredError')
export class AuthTelegramCodeIsExpiredError extends RuntimeError {
  constructor() {
    super('AuthTelegramCodeIsExpiredError', {});
  }

  get message(): string {
    return `Received telegram auth code is expired`;
  }
}
