import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MockSpecificationResolver } from '@shared/db';

import { UserRoleByUserSpecification } from '../../../../../Domain';

@RegisterSpecificationResolver(UserRoleByUserSpecification)
export class UserRoleByUserSpecificationResolver extends MockSpecificationResolver<UserRoleByUserSpecification> {
  setup(): void {
    this.addPredicate((spec) => async (entities) => entities.filter((entity) => spec.isSatisfied(entity)));
  }
}
