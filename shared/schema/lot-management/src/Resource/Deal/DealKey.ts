import { CoreSchema } from '@schema/core';

export interface DealKey extends CoreSchema.ResourceKey<'deal'> {
  id: number;
}
