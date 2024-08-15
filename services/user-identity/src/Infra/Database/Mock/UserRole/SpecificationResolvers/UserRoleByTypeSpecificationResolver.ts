import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MockSpecificationResolver } from '@shared/db';

import { UserRoleByTypeSpecification } from '../../../../../Domain';

@RegisterSpecificationResolver(UserRoleByTypeSpecification)
export class UserRoleByTypeSpecificationResolver extends MockSpecificationResolver<UserRoleByTypeSpecification> {
  setup(): void {
    this.addPredicate((spec) => async (entities) => entities.filter((entity) => spec.isSatisfied(entity)));
  }
}
