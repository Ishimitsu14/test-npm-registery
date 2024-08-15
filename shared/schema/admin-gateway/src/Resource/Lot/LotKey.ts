import { CoreSchema } from '@schema/core';

export interface LotKey extends CoreSchema.ResourceKey<'lot'> {
  id: number;
}
