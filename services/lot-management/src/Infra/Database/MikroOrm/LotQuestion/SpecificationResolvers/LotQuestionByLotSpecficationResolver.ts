import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MikroOrmSpecificationResolver } from '@shared/db';

import { LotQuestionByLotSpecfication } from '../../../../../Domain';
import { LotQuestionSnapshot } from '../Snapshots';

@RegisterSpecificationResolver(LotQuestionByLotSpecfication)
export class LotQuestionByLotSpecficationResolver extends MikroOrmSpecificationResolver<LotQuestionByLotSpecfication, LotQuestionSnapshot> {
  setup(): void {
    this.addWhere(async (spec, payload) => ({
      lot: {
        $in: spec.lotPKs.map((m) => m.id),
      },
    }));
  }
}
