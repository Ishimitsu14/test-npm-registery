import { MEDIATOR_TRIGGER_NOTIFICATION_TYPES } from './const';
import { MediatorNotificationClass } from './IMediatorNotification';

export function RegisterMediatorNotificationTrigger(notification: MediatorNotificationClass): ClassDecorator {
  return (target) => {
    const prevNotificationTypes = Reflect.getMetadata(MEDIATOR_TRIGGER_NOTIFICATION_TYPES, target) || [];
    Reflect.defineMetadata(MEDIATOR_TRIGGER_NOTIFICATION_TYPES, [...prevNotificationTypes, notification], target);
  };
}
