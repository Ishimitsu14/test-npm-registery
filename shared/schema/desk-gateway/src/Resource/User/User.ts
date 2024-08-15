import { CoreSchema } from '@schema/core';

import { UserKey } from './UserKey';

export interface User extends CoreSchema.Resource<'user', UserKey> {
  registeredAt: number;
  nickname: string;
  address: string;
  isVerified: boolean;
}
