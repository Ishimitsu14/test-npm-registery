import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MockSpecificationResolver } from '@shared/db';

import { ViewLotByLotSpecification } from '../../../../../Domain';

@RegisterSpecificationResolver(ViewLotByLotSpecification)
export class ViewLotByLotSpecificationResolver extends MockSpecificationResolver<ViewLotByLotSpecification> {
  setup() {
    this.addPredicate(async (spec) => async (entities) => entities.filter((entity) => spec.isSatisfied(entity)));
  }
}
