import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MikroOrmSpecificationResolver } from '@shared/db';

import { LotByReassignmentTypeSpecification } from '../../../../../Domain';
import { LotSnapshot } from '../Snapshots';

@RegisterSpecificationResolver(LotByReassignmentTypeSpecification)
export class LotByReassignmentTypeSpecificationResolver extends MikroOrmSpecificationResolver<LotByReassignmentTypeSpecification, LotSnapshot> {
  setup(): void {
    this.addWhere(async (spec) => ({
      attributes: {
        investDocReassignmentType: {
          $in: spec.types.map((m) => m.id),
        },
      },
    }));
  }
}
