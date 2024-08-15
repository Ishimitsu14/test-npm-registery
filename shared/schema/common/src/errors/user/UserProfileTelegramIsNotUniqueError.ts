import { RuntimeError } from '@ddd/errors';

export interface UserProfileTelegramIsNotUniqueErrorParams {
  id: string;
  telegram: string;
}

@RuntimeError.RegisterError('UserProfileTelegramIsNotUniqueError')
export class UserProfileTelegramIsNotUniqueError extends RuntimeError<UserProfileTelegramIsNotUniqueErrorParams> {
  constructor(id: string, telegram: string) {
    super('UserProfileTelegramIsNotUniqueError', { id, telegram });
  }

  get message(): string {
    return `User with id ${this.params.id} must have unique telegram account. User with ${this.params.telegram} already exists`;
  }
}
