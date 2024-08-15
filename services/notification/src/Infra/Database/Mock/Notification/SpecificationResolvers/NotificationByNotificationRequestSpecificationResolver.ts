import { Query, RegisterSpecificationResolver } from '@ddd/specifications';
import { forwardRef } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { MockSpecificationResolver } from '@shared/db';

import { NotificationByNotificationRequestSpecification, NotificationRequest } from '../../../../../Domain';
import { NotificationRequestRepository } from '../../NotificationRequest';

@RegisterSpecificationResolver(NotificationByNotificationRequestSpecification)
export class NotificationByNotificationRequestSpecificationResolver extends MockSpecificationResolver<NotificationByNotificationRequestSpecification> {
  @InjectContext(forwardRef(() => NotificationRequestRepository))
  private notificationRequestRepository: InjectContext<NotificationRequestRepository>;

  setup(): void {
    this.addPredicate(async (spec, payload) => {
      if (Array.isArray(spec.notificationRequests)) return (entities) => entities.filter((entity) => spec.isSatisfied(entity));

      const innerSpec = spec.notificationRequests;
      const innerRepository = await this.notificationRequestRepository();
      const innerResult = await innerRepository.find(Query.create(NotificationRequest).addSpecification(innerSpec));
      const innerItemsSpec = new NotificationByNotificationRequestSpecification(innerResult.items);

      return (entities) => entities.filter((entity) => innerItemsSpec.isSatisfied(entity));
    });
  }
}
