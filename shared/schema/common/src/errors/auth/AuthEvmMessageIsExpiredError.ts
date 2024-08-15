import { RuntimeError } from '@ddd/errors';

@RuntimeError.RegisterError('AuthEvmMessageIsExpiredError')
export class AuthEvmMessageIsExpiredError extends RuntimeError {
  constructor() {
    super('AuthEvmMessageIsExpiredError', {});
  }

  get message(): string {
    return `Auth message is expired. Please try again.`;
  }
}
