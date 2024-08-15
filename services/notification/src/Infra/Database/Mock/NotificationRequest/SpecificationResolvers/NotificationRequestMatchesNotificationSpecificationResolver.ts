import { Query, RegisterSpecificationResolver } from '@ddd/specifications';
import { InjectContext } from '@packages/nestjs-request-context';
import { MockSpecificationResolver } from '@shared/db';

import { Notification, NotificationRequestMatchesNotificationSpecification } from '../../../../../Domain';
import { NotificationRepository } from '../../Notification/NotificationRepository';

@RegisterSpecificationResolver(NotificationRequestMatchesNotificationSpecification)
export class NotificationRequestMatchesNotificationSpecificationResolver extends MockSpecificationResolver<NotificationRequestMatchesNotificationSpecification> {
  @InjectContext(NotificationRepository)
  private notificationRepository: InjectContext<NotificationRepository>;

  setup(): void {
    this.addPredicate(async (spec, payload) => {
      if (Array.isArray(spec.notifications)) return (entities) => entities.filter((entity) => spec.isSatisfied(entity));
      const innerSpec = spec.notifications;
      const innerRepository = await this.notificationRepository();
      const innerResult = await innerRepository.find(Query.create(Notification).addSpecification(innerSpec));
      const innerItemsSpec = new NotificationRequestMatchesNotificationSpecification(innerResult.items);
      return (entities) => entities.filter((entity) => innerItemsSpec.isSatisfied(entity));
    });
  }
}
