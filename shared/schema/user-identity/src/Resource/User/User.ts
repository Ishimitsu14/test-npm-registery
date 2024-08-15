import { CoreSchema } from '@schema/core';

import { UserRole } from '../UserRole';
import { UserAuthData } from './UserAuthData';
import { UserKey } from './UserPK';
import { UserProfile } from './UserProfile';
import { UserVerification } from './UserVerification';

export interface User extends CoreSchema.Resource<'user', UserKey> {
  registered_at: number;
  nickname: string;
  profile: UserProfile;
  auth_data: UserAuthData;
  verification: UserVerification;
  roles: UserRole[];
}
