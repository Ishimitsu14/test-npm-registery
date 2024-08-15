import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MikroOrmSpecificationResolver } from '@shared/db';

import { AssetBySearchSpecification } from '../../../../../Domain';
import { AssetSnapshot } from '../Snapshots';

@RegisterSpecificationResolver(AssetBySearchSpecification)
export class AssetBySearchSpecificationResolver extends MikroOrmSpecificationResolver<AssetBySearchSpecification, AssetSnapshot> {
  setup(): void {
    this.addWhere(async (spec) => ({
      info: {
        title: {
          $ilike: `%${spec.search.toLowerCase()}%`,
        },
      },
    }));
  }
}
