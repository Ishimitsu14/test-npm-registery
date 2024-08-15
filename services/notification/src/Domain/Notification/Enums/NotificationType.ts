import { Enumeration } from '@ddd/domain';
import { NotificationSchema } from '@schema/notification';

export class NotificationType extends Enumeration<NotificationSchema.NotificationType> {
  static getDefaults(): Map<NotificationType, boolean> {
    const types = NotificationType.getAll();
    const map = new Map<NotificationType, boolean>();
    for (const type of types) {
      map.set(type, true);
    }
    return map;
  }

  static SYSTEM_INFO = new NotificationType('SYSTEM_INFO');

  static DEAL_CREATED = new NotificationType('DEAL_CREATED');
  static DEAL_STATUS_CHANGED = new NotificationType('DEAL_STATUS_CHANGED');

  static LOT_CREATED = new NotificationType('LOT_CREATED');
  static LOT_STATUS_CHANGED = new NotificationType('LOT_STATUS_CHANGED');

  static BID_RECEIVED = new NotificationType('BID_RECEIVED');
  static BID_STATUS_CHANGED = new NotificationType('BID_STATUS_CHANGED');

  static USER_REGISTERED = new NotificationType('USER_REGISTERED');
  static USER_PROFILE_CHANGED = new NotificationType('USER_PROFILE_CHANGED');

  static LOT_QUESTION_RECEIVED = new NotificationType('LOT_QUESTION_RECEIVED');
  static LOT_QUESTION_PUBLISHED = new NotificationType('LOT_QUESTION_PUBLISHED');
}
