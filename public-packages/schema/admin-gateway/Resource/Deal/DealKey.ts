import { CoreSchema } from '../../../core';

export interface DealKey extends CoreSchema.ResourceKey<'deal'> {
  id: number;
}
