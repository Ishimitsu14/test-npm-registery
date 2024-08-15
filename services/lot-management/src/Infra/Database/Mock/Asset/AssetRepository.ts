import { MockRepository } from '@shared/db';

import { Asset, IAssetRepository } from '../../../../Domain';

export class AssetRepository extends MockRepository<Asset> implements IAssetRepository {
  readonly EntityType = Asset;
}
