import { CoreSchema } from '@schema/core';
import { UserRole } from '../UserRole';
import { UserAuthData } from './UserAuthData';
import { UserKey } from './UserKey';
import { UserProfile } from './UserProfile';
import { UserVerification } from './UserVerification';
export interface User extends CoreSchema.Resource<'user', UserKey> {
    registeredAt: number;
    nickname: string;
    profile: UserProfile;
    verification: UserVerification;
    authData: UserAuthData;
    roles: UserRole[];
}
