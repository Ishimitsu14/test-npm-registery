import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MikroOrmSpecificationResolver } from '@shared/db';

import { NotificationByRecipientSpecification } from '../../../../../Domain';
import { NotificationSnapshot } from '../Snapshots';

@RegisterSpecificationResolver(NotificationByRecipientSpecification)
export class NotificationByRecipientSpecificationResolver extends MikroOrmSpecificationResolver<NotificationByRecipientSpecification, NotificationSnapshot> {
  setup(): void {
    this.addWhere(async (spec) => ({
      recipientId: {
        $in: spec.recipients.map((recipient) => recipient.id),
      },
    }));
  }
}
