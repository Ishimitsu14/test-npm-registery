import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MockSpecificationResolver } from '@shared/db';

import { NotificationByIsReadedSpecification } from '../../../../../Domain';

@RegisterSpecificationResolver(NotificationByIsReadedSpecification)
export class NotificationByIsReadedSpecificationResolver extends MockSpecificationResolver<NotificationByIsReadedSpecification> {
  setup(): void {
    this.addPredicate(async (spec, payload) => async (entities) => entities.filter((entity) => spec.isSatisfied(entity)));
  }
}
