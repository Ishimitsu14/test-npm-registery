import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MikroOrmSpecificationResolver } from '@shared/db';

import { AssetByTierSpecification } from '../../../../../Domain';
import { AssetSnapshot } from '../Snapshots';

@RegisterSpecificationResolver(AssetByTierSpecification)
export class AssetByTierSpecificationResolver extends MikroOrmSpecificationResolver<AssetByTierSpecification, AssetSnapshot> {
  setup(): void {
    this.addWhere(async (spec) => {
      return {
        info: {
          tier: {
            $in: spec.tiers.map((m) => m.id),
          },
        },
      };
    });
  }
}
