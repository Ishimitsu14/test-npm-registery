import { RuntimeError } from '@ddd/errors';

@RuntimeError.RegisterError('AuthEvmMessageIsInvalidError')
export class AuthEvmMessageIsInvalidError extends RuntimeError {
  constructor() {
    super('AuthEvmMessageIsInvalidError', {});
  }

  get message(): string {
    return `Auth message is empty or invalid.`;
  }
}
