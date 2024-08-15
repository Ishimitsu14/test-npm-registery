import { CoreSchema } from '@schema/core';

import { AssetCreateRequestKey } from './AssetCreateRequestKey';

export interface AssetCreateRequest extends CoreSchema.Resource<'asset_create_request', AssetCreateRequestKey> {
  title: string;
  website: string;
}
