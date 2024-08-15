import { CoreSchema } from '../../../core';

export interface UserKey extends CoreSchema.ResourceKey<'user'> {
  id: string;
}
