import { RegisterSpecificationResolver, WhereInPKSpecification } from '@ddd/specifications';
import { forwardRef } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { MikroOrmSpecificationResolver } from '@shared/db';

import { NotificationRequestMatchesNotificationSpecification } from '../../../../../Domain';
import { NotificationRepository } from '../../Notification';
import { NotificationRequestSnapshot } from '../Snapshots';

@RegisterSpecificationResolver(NotificationRequestMatchesNotificationSpecification)
export class NotificationRequestMatchesNotificationSpecificationResolver extends MikroOrmSpecificationResolver<NotificationRequestMatchesNotificationSpecification, NotificationRequestSnapshot> {
  @InjectContext(forwardRef(() => NotificationRepository))
  private notificationRepository: InjectContext<NotificationRepository>;

  setup(): void {
    this.addPredicate(async (spec) => {
      const notificationRepository = await this.notificationRepository();

      const matchesSpec = Array.isArray(spec.notifications) ? WhereInPKSpecification.create(spec.notifications.map((m) => m.primaryKey)) : spec.notifications;
      const wrapperSpec = await this.queryResolver.resolveSpecification(matchesSpec, notificationRepository);
      const queryBuilderSpec = wrapperSpec(notificationRepository.createEmptyQueryBuilder(notificationRepository.em));

      return (builder) => {
        return builder.where({
          id: {
            $in: queryBuilderSpec.select('notificationRequest').getKnexQuery(),
          },
        });
      };
    });
  }
}
