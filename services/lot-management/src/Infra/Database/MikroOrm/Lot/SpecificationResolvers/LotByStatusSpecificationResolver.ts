import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MikroOrmSpecificationResolver } from '@shared/db';

import { LotByStatusSpecification } from '../../../../../Domain';
import { LotSnapshot } from '../Snapshots';

@RegisterSpecificationResolver(LotByStatusSpecification)
export class LotByStatusSpecificationResolver extends MikroOrmSpecificationResolver<LotByStatusSpecification, LotSnapshot> {
  setup(): void {
    this.addWhere(async (spec) => ({
      status: {
        $in: spec.statuses.map((m) => m.id),
      },
    }));
  }
}
