import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MockSpecificationResolver } from '@shared/db';

import { NotificationByRecipientSpecification } from '../../../../../Domain';

@RegisterSpecificationResolver(NotificationByRecipientSpecification)
export class NotificationByRecipientSpecificationResolver extends MockSpecificationResolver<NotificationByRecipientSpecification> {
  setup(): void {
    this.addPredicate(async (spec, payload) => async (entities) => entities.filter((entity) => spec.isSatisfied(entity)));
  }
}
