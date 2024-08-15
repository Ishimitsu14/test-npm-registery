import { RuntimeError } from '@ddd/errors';

export interface UserRoleUserAlreadyHasRoleParams {
  userId: string;
  role: string;
}

@RuntimeError.RegisterError('UserRoleUserAlreadyHasRole')
export class UserRoleUserAlreadyHasRole extends RuntimeError<UserRoleUserAlreadyHasRoleParams> {
  constructor(userId: string, role: string) {
    super('UserRoleUserAlreadyHasRole', { userId, role });
  }

  get message(): string {
    return `User with id ${this.params.userId} already has role ${this.params.role}`;
  }
}
