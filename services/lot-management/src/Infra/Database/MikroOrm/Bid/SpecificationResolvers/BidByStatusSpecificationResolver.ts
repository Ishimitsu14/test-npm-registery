import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MikroOrmSpecificationResolver } from '@shared/db';

import { BidByStatusSpecification } from '../../../../../Domain';
import { BidSnapshot } from '../Snapshots';

@RegisterSpecificationResolver(BidByStatusSpecification)
export class BidByStatusSpecificationResolver extends MikroOrmSpecificationResolver<BidByStatusSpecification, BidSnapshot> {
  setup(): void {
    this.addWhere(async (spec) => ({
      status: {
        $in: spec.statuses.map((m) => m.id),
      },
    }));
  }
}
