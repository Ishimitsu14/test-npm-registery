import { MikroOrmRepository } from '@shared/db';

import { Asset, IAssetRepository } from '../../../../Domain';
import { AssetSnapshot } from './Snapshots';

export class AssetRepository extends MikroOrmRepository<Asset, AssetSnapshot> implements IAssetRepository {
  readonly EntityType = Asset;
  readonly SnapshotType = AssetSnapshot;
}
