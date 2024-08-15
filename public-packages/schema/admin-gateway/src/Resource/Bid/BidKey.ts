import { CoreSchema } from '@schema/core';

export interface BidKey extends CoreSchema.ResourceKey<'bid'> {
  id: number;
}
