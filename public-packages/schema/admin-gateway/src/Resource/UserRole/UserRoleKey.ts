import { CoreSchema } from '@schema/core';

export interface UserRoleKey extends CoreSchema.ResourceKey<'user_role'> {
  id: string;
}
