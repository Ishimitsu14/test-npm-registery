import { MikroOrmRepository } from '@shared/db';
import { v4 } from 'uuid';

import { AssetFaq, AssetFaqPK, IAssetFaqRepository } from '../../../../Domain';
import { AssetFaqSnapshot } from './Snapshots';

export class AssetFaqRepository extends MikroOrmRepository<AssetFaq, AssetFaqSnapshot> implements IAssetFaqRepository {
  readonly EntityType = AssetFaq;
  readonly SnapshotType = AssetFaqSnapshot;

  async nextPK(): Promise<AssetFaqPK> {
    return AssetFaqPK.raw(v4());
  }
}
