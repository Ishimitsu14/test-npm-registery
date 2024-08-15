import { CoreSchema } from '@schema/core';

import { User, UserKey, UserRoleType } from '../../Resource';

export namespace UserList {
  export type Filter = CoreSchema.CompositeFilter<{
    id?: UserKey['id'][];
    nickname?: User['nickname'][];
    address?: User['auth_data']['address'][];
    isVerified?: boolean;
    search?: string;
    roleType?: UserRoleType[];
  }>;

  export type Include = CoreSchema.Include<User, {}>;

  export type Payload = CoreSchema.WithFilter<Filter> & CoreSchema.WithPagination & CoreSchema.WithInclude<Include>;
  export type Result = CoreSchema.WithPaginationResult<User> & CoreSchema.WithIncludeLinks<Include>;
}
