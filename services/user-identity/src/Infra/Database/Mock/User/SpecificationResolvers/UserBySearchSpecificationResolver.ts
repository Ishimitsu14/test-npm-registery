import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MockSpecificationResolver } from '@shared/db';

import { UserBySearchSpecification } from '../../../../../Domain';

@RegisterSpecificationResolver(UserBySearchSpecification)
export class UserBySearchSpecificationResolver extends MockSpecificationResolver<UserBySearchSpecification> {
  setup() {
    this.addPredicate((spec) => async (entities) => entities.filter((entity) => spec.isSatisfied(entity)));
  }
}
