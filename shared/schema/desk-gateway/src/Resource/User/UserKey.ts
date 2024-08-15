import { CoreSchema } from '@schema/core';

export interface UserKey extends CoreSchema.ResourceKey<'user'> {
  id: string;
}
