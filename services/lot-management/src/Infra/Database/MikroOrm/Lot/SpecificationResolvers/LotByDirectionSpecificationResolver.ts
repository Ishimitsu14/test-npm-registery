import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MikroOrmSpecificationResolver } from '@shared/db';

import { LotByDirectionSpecification } from '../../../../../Domain';
import { LotSnapshot } from '../Snapshots';

@RegisterSpecificationResolver(LotByDirectionSpecification)
export class LotByDirectionSpecificationResolver extends MikroOrmSpecificationResolver<LotByDirectionSpecification, LotSnapshot> {
  setup(): void {
    this.addWhere(async (spec) => ({
      attributes: {
        commonDirection: {
          $in: spec.directions.map((m) => m.id),
        },
      },
    }));
  }
}
