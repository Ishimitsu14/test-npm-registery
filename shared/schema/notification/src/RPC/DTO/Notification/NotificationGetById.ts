import { Notification, NotificationRecipientPK, NotificationRequestPK } from '../../../Resource';

export namespace NotificationGetById {
  export type Payload = {
    notificationId: NotificationRequestPK['notificationRequestId'];
    recipientId: NotificationRecipientPK['id'];
  };
  export type Result = Notification;
}
