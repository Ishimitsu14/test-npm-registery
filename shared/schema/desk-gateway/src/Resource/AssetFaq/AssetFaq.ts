import { CoreSchema } from '@schema/core';

import { AssetKey } from '../Asset';
import { AssetFaqKey } from './AssetFaqPK';

export interface AssetFaq extends CoreSchema.Resource<'asset_faq', AssetFaqKey> {
  assetKey: AssetKey;
  question: string;
  answer: string;
  createdAt: number;
}
