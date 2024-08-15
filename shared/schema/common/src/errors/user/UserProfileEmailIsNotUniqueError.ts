import { RuntimeError } from '@ddd/errors';

export interface UserProfileEmailIsNotUniqueErrorParams {
  id: string;
  email: string;
}

@RuntimeError.RegisterError('UserProfileEmailIsNotUniqueError')
export class UserProfileEmailIsNotUniqueError extends RuntimeError<UserProfileEmailIsNotUniqueErrorParams> {
  constructor(id: string, email: string) {
    super('UserProfileEmailIsNotUniqueError', { id, email });
  }

  get message(): string {
    return `User with id ${this.params.id} must have unique telegram account. User with telegram "${this.params.email}" already exists`;
  }
}
