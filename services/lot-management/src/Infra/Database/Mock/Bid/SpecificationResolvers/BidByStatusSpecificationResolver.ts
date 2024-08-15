import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MockSpecificationResolver } from '@shared/db';

import { BidByStatusSpecification } from '../../../../../Domain';

@RegisterSpecificationResolver(BidByStatusSpecification)
export class BidByStatusSpecificationResolver extends MockSpecificationResolver<BidByStatusSpecification> {
  setup(): void {
    this.addPredicate(async (spec) => async (entities) => entities.filter((entity) => spec.isSatisfied(entity)));
  }
}
