import { RuntimeError } from '@ddd/errors';

@RuntimeError.RegisterError('AuthEvmMessageSignatureInvalidError')
export class AuthEvmMessageSignatureInvalidError extends RuntimeError {
  constructor() {
    super('AuthEvmMessageSignatureInvalidError', {});
  }

  get message(): string {
    return `Signature is not valid`;
  }
}
