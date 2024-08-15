import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MockSpecificationResolver } from '@shared/db';

import { NotificationRequestByTypeSpecification } from '../../../../../Domain';

@RegisterSpecificationResolver(NotificationRequestByTypeSpecification)
export class NotificationRequestByTypeSpecificationResolver extends MockSpecificationResolver<NotificationRequestByTypeSpecification> {
  setup(): void {
    this.addPredicate(async (spec, payload) => async (entities) => entities.filter((entity) => spec.isSatisfied(entity)));
  }
}
