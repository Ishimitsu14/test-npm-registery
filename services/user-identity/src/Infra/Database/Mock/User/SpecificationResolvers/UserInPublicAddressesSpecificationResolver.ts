import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MockSpecificationResolver } from '@shared/db';

import { UserByAddressSpecification } from '../../../../../Domain';

@RegisterSpecificationResolver(UserByAddressSpecification)
export class UserInPublicAddressesSpecificationResolver extends MockSpecificationResolver<UserByAddressSpecification> {
  setup(): void {
    this.addPredicate((spec) => async (entities) => entities.filter((entity) => spec.isSatisfied(entity)));
  }
}
