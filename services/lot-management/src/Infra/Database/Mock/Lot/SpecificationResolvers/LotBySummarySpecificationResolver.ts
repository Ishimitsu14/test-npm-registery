import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MockSpecificationResolver } from '@shared/db';

import { LotBySummarySpecification } from '../../../../../Domain';

@RegisterSpecificationResolver(LotBySummarySpecification)
export class LotBySummarySpecificationResolver extends MockSpecificationResolver<LotBySummarySpecification> {
  setup(): void {
    this.addPredicate(async (spec) => async (entities) => entities.filter((entity) => spec.isSatisfied(entity)));
  }
}
