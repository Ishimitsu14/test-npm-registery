import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MikroOrmSpecificationResolver } from '@shared/db';

import { AssetByVerticalsSpecification } from '../../../../../Domain';
import { AssetSnapshot } from '../Snapshots';

@RegisterSpecificationResolver(AssetByVerticalsSpecification)
export class AssetByVerticalsSpecificationResolver extends MikroOrmSpecificationResolver<AssetByVerticalsSpecification, AssetSnapshot> {
  setup(): void {
    this.addWhere(async (spec) => ({
      info: {
        verticals: {
          $overlap: spec.verticals.map((m) => m.id),
        },
      },
    }));
  }
}
