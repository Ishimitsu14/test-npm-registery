import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MockSpecificationResolver } from '@shared/db';

import { UserByProfileTelegramSpecification } from '../../../../../Domain';

@RegisterSpecificationResolver(UserByProfileTelegramSpecification)
export class UserByProfileTelegramSpecificationResolver extends MockSpecificationResolver<UserByProfileTelegramSpecification> {
  setup() {
    this.addPredicate((spec) => async (entities) => entities.filter((entity) => spec.isSatisfied(entity)));
  }
}
