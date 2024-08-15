import { RuntimeError } from '@ddd/errors';

export interface AuthNotAuthorizedErrorParams {}

@RuntimeError.RegisterError('AuthNotAuthorizedError')
export class AuthNotAuthorizedError extends RuntimeError<AuthNotAuthorizedErrorParams> {
  constructor() {
    super('AuthNotAuthorizedError', {});
  }

  get message(): string {
    return 'Not authorized.';
  }
}
