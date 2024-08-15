import { RuntimeError } from '@ddd/errors';

export interface UserNotFoundErrorParams {
  id: string;
}

@RuntimeError.RegisterError('UserNotFoundError')
export class UserNotFoundError extends RuntimeError<UserNotFoundErrorParams> {
  constructor(id: string) {
    super('UserNotFoundError', { id });
  }

  get message(): string {
    return `User with id ${this.params.id} not found`;
  }
}
