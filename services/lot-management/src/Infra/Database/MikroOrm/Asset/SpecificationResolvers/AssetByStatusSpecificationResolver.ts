import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MikroOrmSpecificationResolver } from '@shared/db';

import { AssetByStatusSpecification } from '../../../../../Domain';
import { AssetSnapshot } from '../Snapshots';

@RegisterSpecificationResolver(AssetByStatusSpecification)
export class AssetByStatusSpecificationResolver extends MikroOrmSpecificationResolver<AssetByStatusSpecification, AssetSnapshot> {
  setup(): void {
    this.addWhere(async (spec) => ({
      status: {
        $in: spec.statuses.map((m) => m.id),
      },
    }));
  }
}
