import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MikroOrmSpecificationResolver } from '@shared/db';

import { NotificationByIsReadedSpecification } from '../../../../../Domain';
import { NotificationSnapshot } from '../Snapshots';

@RegisterSpecificationResolver(NotificationByIsReadedSpecification)
export class NotificationByIsReadedSpecificationResolver extends MikroOrmSpecificationResolver<NotificationByIsReadedSpecification, NotificationSnapshot> {
  setup(): void {
    this.addWhere(async (spec) => ({
      isReaded: spec.isReaded,
    }));
  }
}
