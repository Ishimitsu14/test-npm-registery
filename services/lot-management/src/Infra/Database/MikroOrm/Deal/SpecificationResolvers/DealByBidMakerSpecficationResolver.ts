import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MikroOrmSpecificationResolver } from '@shared/db';

import { DealByBidMakerSpecfication } from '../../../../../Domain';
import { DealSnapshot } from '../Snapshots';

@RegisterSpecificationResolver(DealByBidMakerSpecfication)
export class DealByBidMakerSpecficationResolver extends MikroOrmSpecificationResolver<DealByBidMakerSpecfication, DealSnapshot> {
  setup(): void {
    this.addWhere(async (spec) => ({
      bidMakers: {
        $overlap: spec.bidMakerPKs.map((m) => m.userId),
      },
    }));
  }
}
