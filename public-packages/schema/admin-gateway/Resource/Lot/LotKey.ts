import { CoreSchema } from '../../../core';

export interface LotKey extends CoreSchema.ResourceKey<'lot'> {
  id: number;
}
