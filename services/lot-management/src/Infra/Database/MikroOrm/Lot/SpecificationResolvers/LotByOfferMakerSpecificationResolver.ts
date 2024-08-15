import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MikroOrmSpecificationResolver } from '@shared/db';

import { LotByOfferMakerSpecification } from '../../../../../Domain';
import { LotSnapshot } from '../Snapshots';

@RegisterSpecificationResolver(LotByOfferMakerSpecification)
export class LotByOfferMakerSpecificationResolver extends MikroOrmSpecificationResolver<LotByOfferMakerSpecification, LotSnapshot> {
  setup(): void {
    this.addWhere(async (spec) => ({
      offerMaker: {
        $in: spec.offerMakerPKs.map((m) => m.userId),
      },
    }));
  }
}
