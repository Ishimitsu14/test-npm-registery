import { CoreSchema } from '../../../core';

export interface BidKey extends CoreSchema.ResourceKey<'bid'> {
  id: number;
}
