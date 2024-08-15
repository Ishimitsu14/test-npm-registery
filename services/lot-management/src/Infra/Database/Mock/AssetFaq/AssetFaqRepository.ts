import { MockRepository } from '@shared/db';
import { v4 } from 'uuid';

import { AssetFaq, AssetFaqPK, IAssetFaqRepository } from '../../../../Domain';

export class AssetFaqRepository extends MockRepository<AssetFaq> implements IAssetFaqRepository {
  readonly EntityType = AssetFaq;

  async nextPK(): Promise<AssetFaqPK> {
    return AssetFaqPK.raw(v4());
  }
}
