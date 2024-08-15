import { CoreSchema } from '@schema/core';

export interface AssetKey extends CoreSchema.ResourceKey<'asset'> {
  id: string;
}
