import { CoreSchema } from '@ishimitsu-org/schema-core';

import { User, UserAuthData, UserKey } from '../../../Resource';

export type UserListFilter = CoreSchema.CompositeFilter<{
  id?: UserKey['id'][];

  nickname?: User['nickname'][];
  isVerified?: boolean;
  address?: UserAuthData['walletAddress'][];
  search?: string;
}>;
export type UserListInclude = CoreSchema.Include<User, {}>;
export type UserListPayload =
  CoreSchema.WithFilter<UserListFilter>
  & CoreSchema.WithInclude<UserListInclude>
  & CoreSchema.WithPagination;
export type UserListResult = CoreSchema.WithPaginationResult<User> & CoreSchema.WithIncludeLinks<UserListInclude>;
