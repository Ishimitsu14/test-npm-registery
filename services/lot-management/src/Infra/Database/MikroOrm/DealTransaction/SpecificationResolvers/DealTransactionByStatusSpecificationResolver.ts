import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MikroOrmSpecificationResolver } from '@shared/db';

import { DealTransactionByStatusSpecification } from '../../../../../Domain';
import { DealTransactionSnapshot } from '../Snapshots';

@RegisterSpecificationResolver(DealTransactionByStatusSpecification)
export class DealTransactionByStatusSpecificationResolver extends MikroOrmSpecificationResolver<DealTransactionByStatusSpecification, DealTransactionSnapshot> {
  setup(): void {
    this.addWhere(async (spec) => ({
      status: {
        $in: spec.statuses.map((m) => m.id),
      },
    }));
  }
}
