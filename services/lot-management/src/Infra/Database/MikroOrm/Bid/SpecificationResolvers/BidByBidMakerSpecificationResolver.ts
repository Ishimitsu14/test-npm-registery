import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MikroOrmSpecificationResolver } from '@shared/db';

import { BidByBidMakerSpecification } from '../../../../../Domain';
import { BidSnapshot } from '../Snapshots';

@RegisterSpecificationResolver(BidByBidMakerSpecification)
export class BidByBidMakerSpecificationResolver extends MikroOrmSpecificationResolver<BidByBidMakerSpecification, BidSnapshot> {
  setup(): void {
    this.addWhere(async (spec, payload) => ({
      bidMakerId: {
        $in: spec.bidMakerPKs.map((m) => m.userId),
      },
    }));
  }
}
