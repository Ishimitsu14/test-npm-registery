import { RuntimeError } from '@ddd/errors';

export interface UserWithTelegramUsernameNotFoundErrorParams {
  username: string;
}

@RuntimeError.RegisterError('UserWithTelegramUsernameNotFoundError')
export class UserWithTelegramUsernameNotFoundError extends RuntimeError<UserWithTelegramUsernameNotFoundErrorParams> {
  constructor(username: string) {
    super('UserWithTelegramUsernameNotFoundError', { username });
  }

  get message(): string {
    return `User with telegram username ${this.params.username} not found`;
  }
}
