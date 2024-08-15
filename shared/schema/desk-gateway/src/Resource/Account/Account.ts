import { CoreSchema } from '@schema/core';

import { UserKey } from '../User';
import { AccountAuthData } from './AccountAuthData';
import { AccountProfile } from './AccountProfile';
import { AccountVerification } from './AccountVerification';

export interface Account extends CoreSchema.Resource<'account', UserKey> {
  registeredAt: number;
  nickname: string;
  profile: AccountProfile;
  verification: AccountVerification;
  authData?: AccountAuthData;
}
