import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MikroOrmSpecificationResolver } from '@shared/db';

import { DealByOfferMakerSpecfication } from '../../../../../Domain';
import { DealSnapshot } from '../Snapshots';

@RegisterSpecificationResolver(DealByOfferMakerSpecfication)
export class DealByOfferMakerSpecficationResolver extends MikroOrmSpecificationResolver<DealByOfferMakerSpecfication, DealSnapshot> {
  setup(): void {
    this.addWhere(async (spec) => ({
      offerMakers: {
        $overlap: spec.offerMakerPKs.map((m) => m.userId),
      },
    }));
  }
}
