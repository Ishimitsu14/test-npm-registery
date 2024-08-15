import { Notification, NotificationKey } from '../../../Resource';

export namespace NotificationGetById {
  export type Payload = {
    notificationId: NotificationKey['notificationId'];
  };
  export type Result = Notification;
}
