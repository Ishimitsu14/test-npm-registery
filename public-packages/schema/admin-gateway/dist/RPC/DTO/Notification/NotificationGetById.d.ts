import { Notification, NotificationKey } from '../../../Resource';
export type NotificationGetByIdPayload = {
    notificationId: NotificationKey['notificationId'];
};
export type NotificationGetByIdResult = Notification;
