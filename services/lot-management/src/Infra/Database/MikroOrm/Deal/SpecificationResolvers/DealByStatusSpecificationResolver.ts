import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MikroOrmSpecificationResolver } from '@shared/db';

import { DealByStatusSpecification } from '../../../../../Domain';
import { DealSnapshot } from '../Snapshots';

@RegisterSpecificationResolver(DealByStatusSpecification)
export class DealByStatusSpecificationResolver extends MikroOrmSpecificationResolver<DealByStatusSpecification, DealSnapshot> {
  setup(): void {
    this.addWhere(async (spec) => ({
      status: {
        $in: spec.statuses.map((m) => m.id),
      },
    }));
  }
}
