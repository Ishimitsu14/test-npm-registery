import { CoreSchema } from '@schema/core';

export interface BidMakerKey extends CoreSchema.ResourceKey<'bid_maker'> {
  userId: string;
}
