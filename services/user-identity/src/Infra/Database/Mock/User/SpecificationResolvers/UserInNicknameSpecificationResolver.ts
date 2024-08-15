import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MockSpecificationResolver } from '@shared/db';

import { UserByNicknameSpecification } from '../../../../../Domain';

@RegisterSpecificationResolver(UserByNicknameSpecification)
export class UserInNicknameSpecificationResolver extends MockSpecificationResolver<UserByNicknameSpecification> {
  setup(): void {
    this.addPredicate((spec) => async (entities) => entities.filter((entity) => spec.isSatisfied(entity)));
  }
}
