import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MockSpecificationResolver } from '@shared/db';

import { LotQuestionByStatusSpecification } from '../../../../../Domain';

@RegisterSpecificationResolver(LotQuestionByStatusSpecification)
export class LotQuestionByStatusSpecificationResolver extends MockSpecificationResolver<LotQuestionByStatusSpecification> {
  setup(): void {
    this.addPredicate(async (spec) => async (entities) => entities.filter((entity) => spec.isSatisfied(entity)));
  }
}
