import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MikroOrmSpecificationResolver } from '@shared/db';

import { LotByTypeSpecification } from '../../../../../Domain';
import { LotSnapshot } from '../Snapshots';

@RegisterSpecificationResolver(LotByTypeSpecification)
export class LotByTypeSpecificationResolver extends MikroOrmSpecificationResolver<LotByTypeSpecification, LotSnapshot> {
  setup(): void {
    this.addWhere(async (spec) => ({
      type: {
        $in: spec.types.map((m) => m.id),
      },
    }));
  }
}
