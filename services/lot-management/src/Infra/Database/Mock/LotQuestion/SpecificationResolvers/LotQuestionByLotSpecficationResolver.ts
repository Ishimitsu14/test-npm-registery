import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MockSpecificationResolver } from '@shared/db';

import { LotQuestionByLotSpecfication } from '../../../../../Domain';

@RegisterSpecificationResolver(LotQuestionByLotSpecfication)
export class LotQuestionByLotSpecficationResolver extends MockSpecificationResolver<LotQuestionByLotSpecfication> {
  setup(): void {
    this.addPredicate(async (spec) => async (entities) => entities.filter((entity) => spec.isSatisfied(entity)));
  }
}
