import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MikroOrmSpecificationResolver } from '@shared/db';

import { LotQuestionByStatusSpecification } from '../../../../../Domain';
import { LotQuestionSnapshot } from '../Snapshots';

@RegisterSpecificationResolver(LotQuestionByStatusSpecification)
export class LotQuestionByStatusSpecificationResolver extends MikroOrmSpecificationResolver<LotQuestionByStatusSpecification, LotQuestionSnapshot> {
  setup(): void {
    this.addWhere(async (spec) => ({
      status: {
        $in: spec.statuses.map((m) => m.id),
      },
    }));
  }
}
