import { CoreSchema } from '@schema/core';

export interface AssetCreateRequestKey extends CoreSchema.ResourceKey<'asset_create_request'> {
  id: string;
}
