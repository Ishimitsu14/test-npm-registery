import { Enumeration } from '@ddd/domain';
import { UserIdentitySchema } from '@schema/user-identity';

export class UserRoleType extends Enumeration<UserIdentitySchema.UserRoleType> {
  static MODERATOR = new UserRoleType('MODERATOR');
  static ADMIN = new UserRoleType('ADMIN');
}
