import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MockSpecificationResolver } from '@shared/db';

import { DealTransactionByStatusSpecification } from '../../../../../Domain';

@RegisterSpecificationResolver(DealTransactionByStatusSpecification)
export class DealTransactionByStatusSpecificationResolver extends MockSpecificationResolver<DealTransactionByStatusSpecification> {
  setup(): void {
    this.addPredicate(async (spec) => async (entities) => entities.filter((entity) => spec.isSatisfied(entity)));
  }
}
