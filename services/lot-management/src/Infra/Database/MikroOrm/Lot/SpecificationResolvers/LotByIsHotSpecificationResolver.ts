import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MikroOrmSpecificationResolver } from '@shared/db';

import { Lot, LotByIsHotSpecification } from '../../../../../Domain';
import { LotSnapshot } from '../Snapshots';

@RegisterSpecificationResolver(LotByIsHotSpecification)
export class LotByIsHotSpecificationResolver extends MikroOrmSpecificationResolver<LotByIsHotSpecification, LotSnapshot> {
  setup(): void {
    // TODO fix hot score
    this.addWhere(async (spec) => ({
      score: {
        $gte: Lot.HOT_SCORE,
      },
    }));
  }
}
