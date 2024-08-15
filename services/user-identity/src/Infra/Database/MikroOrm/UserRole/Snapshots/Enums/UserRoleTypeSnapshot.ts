import { EnumSnapshot } from '@shared/db';

import { UserRoleType } from '../../../../../../Domain';

export type UserRoleTypeSnapshot = EnumSnapshot<UserRoleType>;
export const UserRoleTypeSnapshot = EnumSnapshot(UserRoleType);
