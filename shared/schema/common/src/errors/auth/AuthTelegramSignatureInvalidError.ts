import { RuntimeError } from '@ddd/errors';

@RuntimeError.RegisterError('AuthTelegramSignatureInvalidError')
export class AuthTelegramSignatureInvalidError extends RuntimeError {
  constructor() {
    super('AuthTelegramSignatureInvalidError', {});
  }

  get message(): string {
    return `Signature is not valid`;
  }
}
