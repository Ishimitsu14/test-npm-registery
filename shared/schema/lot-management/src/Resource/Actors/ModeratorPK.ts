import { CoreSchema } from '@schema/core';

export interface ModeratorKey extends CoreSchema.ResourceKey<'bid_maker'> {
  userId: string;
}
