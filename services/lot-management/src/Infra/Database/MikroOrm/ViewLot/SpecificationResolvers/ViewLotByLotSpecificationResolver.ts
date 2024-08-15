import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MikroOrmSpecificationResolver } from '@shared/db';

import { ViewLotByLotSpecification } from '../../../../../Domain';
import { ViewLotSnapshot } from '../Snapshots';

@RegisterSpecificationResolver(ViewLotByLotSpecification)
export class ViewLotByLotSpecificationResolver extends MikroOrmSpecificationResolver<ViewLotByLotSpecification, ViewLotSnapshot> {
  setup() {
    this.addWhere(async (spec) => ({
      lotId: {
        $in: spec.lotPks.map((m) => m.id),
      },
    }));
  }
}
