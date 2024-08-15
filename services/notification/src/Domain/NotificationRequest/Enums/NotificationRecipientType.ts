import { Enumeration } from '@ddd/domain';
import { NotificationSchema } from '@schema/notification';

export class NotificationRecipientType extends Enumeration<NotificationSchema.NotificationRecipientType> {
  static PUBLIC = new NotificationRecipientType('PUBLIC');
  static OWNER_ID = new NotificationRecipientType('OWNER_ID');
}
