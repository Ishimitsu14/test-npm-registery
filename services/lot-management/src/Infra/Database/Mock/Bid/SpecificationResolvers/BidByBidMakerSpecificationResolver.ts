import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MockSpecificationResolver } from '@shared/db';

import { BidByBidMakerSpecification } from '../../../../../Domain';

@RegisterSpecificationResolver(BidByBidMakerSpecification)
export class BidByBidMakerSpecificationResolver extends MockSpecificationResolver<BidByBidMakerSpecification> {
  setup(): void {
    this.addPredicate(async (spec) => async (entities) => entities.filter((entity) => spec.isSatisfied(entity)));
  }
}
