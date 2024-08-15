import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MikroOrmSpecificationResolver } from '@shared/db';

import { NotificationRequestByTypeSpecification } from '../../../../../Domain';
import { NotificationRequestSnapshot } from '../Snapshots/NotificationRequestSnapshot';

@RegisterSpecificationResolver(NotificationRequestByTypeSpecification)
export class NotificationRequestByTypeSpecificationResolver extends MikroOrmSpecificationResolver<NotificationRequestByTypeSpecification, NotificationRequestSnapshot> {
  setup(): void {
    this.addWhere(async (spec) => ({
      type: {
        $in: spec.type.map((type) => type.id),
      },
    }));
  }
}
