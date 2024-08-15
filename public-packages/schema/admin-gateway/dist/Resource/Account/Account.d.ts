import { CoreSchema } from '@schema/core';
import { UserAuthData, UserKey, UserProfile, UserVerification } from '../User';
import { UserRole } from '../UserRole';
export interface Account extends CoreSchema.Resource<'account', UserKey> {
    registeredAt: number;
    nickname: string;
    profile: UserProfile;
    verification: UserVerification;
    authData?: UserAuthData;
    roles: UserRole[];
}
