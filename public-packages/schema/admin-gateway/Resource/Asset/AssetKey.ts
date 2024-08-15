import { CoreSchema } from '../../../core';

export interface AssetKey extends CoreSchema.ResourceKey<'asset'> {
  id: string;
}
