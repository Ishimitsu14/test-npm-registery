import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MockSpecificationResolver } from '@shared/db';

import { LotByMinSummarySpecification } from '../../../../../Domain';

@RegisterSpecificationResolver(LotByMinSummarySpecification)
export class LotByMinSummarySpecificationResolver extends MockSpecificationResolver<LotByMinSummarySpecification> {
  setup(): void {
    this.addPredicate(async (spec) => async (entities) => entities.filter((entity) => spec.isSatisfied(entity)));
  }
}
