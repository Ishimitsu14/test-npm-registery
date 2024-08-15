import { RegisterSpecificationResolver, WhereInPKSpecification } from '@ddd/specifications';
import { forwardRef } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { MikroOrmSpecificationResolver } from '@shared/db';

import { NotificationByNotificationRequestSpecification } from '../../../../../Domain';
import { NotificationRequestRepository } from '../../NotificationRequest';
import { NotificationSnapshot } from '../Snapshots';

@RegisterSpecificationResolver(NotificationByNotificationRequestSpecification)
export class NotificationByNotificationRequestSpecificationResolver extends MikroOrmSpecificationResolver<NotificationByNotificationRequestSpecification, NotificationSnapshot> {
  @InjectContext(forwardRef(() => NotificationRequestRepository))
  private notificationRequestRepository: InjectContext<NotificationRequestRepository>;

  setup(): void {
    this.addPredicate(async (spec) => {
      const notificationRequestRepository = await this.notificationRequestRepository();

      const matchesSpec = Array.isArray(spec.notificationRequests) ? WhereInPKSpecification.create(spec.notificationRequests.map((m) => m.primaryKey)) : spec.notificationRequests;
      const wrapperSpec = await this.queryResolver.resolveSpecification(matchesSpec, notificationRequestRepository);
      const queryBuilderSpec = wrapperSpec(notificationRequestRepository.createEmptyQueryBuilder(notificationRequestRepository.em));

      return (builder) => {
        return builder.where({
          notificationRequest: {
            id: {
              $in: queryBuilderSpec.select('id').getKnexQuery(),
            },
          },
        });
      };
    });
  }
}
