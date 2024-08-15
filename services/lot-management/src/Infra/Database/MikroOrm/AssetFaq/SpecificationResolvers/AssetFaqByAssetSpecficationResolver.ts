import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MikroOrmSpecificationResolver } from '@shared/db';

import { AssetFaqByAssetSpecfication } from '../../../../../Domain';
import { AssetFaqSnapshot } from '../Snapshots';

@RegisterSpecificationResolver(AssetFaqByAssetSpecfication)
export class AssetFaqByAssetSpecficationResolver extends MikroOrmSpecificationResolver<AssetFaqByAssetSpecfication, AssetFaqSnapshot> {
  setup(): void {
    this.addWhere(async (spec, payload) => ({
      asset: {
        $in: spec.assetPKs.map((m) => m.id),
      },
    }));
  }
}
