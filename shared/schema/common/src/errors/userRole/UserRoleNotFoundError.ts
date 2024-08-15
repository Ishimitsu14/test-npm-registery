import { RuntimeError } from '@ddd/errors';

export interface UserRoleNotFoundErrorParams {
  id: string;
}

@RuntimeError.RegisterError('UserRoleNotFoundError')
export class UserRoleNotFoundError extends RuntimeError<UserRoleNotFoundErrorParams> {
  constructor(id: string) {
    super('UserRoleNotFoundError', { id });
  }

  get message(): string {
    return `User role with id ${this.params.id} not found`;
  }
}
