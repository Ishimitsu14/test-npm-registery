import { DeskGatewaySchema } from '@schema/desk-gateway';
import { NotificationSchema } from '@schema/notification';

export class NotificationConfigResourceMapper {
  toNotificationConfig(item: NotificationSchema.NotificationConfig): Required<DeskGatewaySchema.NotificationConfig> {
    return {
      resource: 'notification_config',
      id: item.recipientKey.id,
      settings: this.toNotificationConfigSettings(item.settings),
    };
  }

  toNotificationConfigSettings(item: NotificationSchema.NotificationConfigSettings): Required<DeskGatewaySchema.NotificationConfigSettings> {
    return {
      BID_RECEIVED: item.BID_RECEIVED,
      BID_STATUS_CHANGED: item.BID_STATUS_CHANGED,
      DEAL_CREATED: item.DEAL_CREATED,
      DEAL_STATUS_CHANGED: item.DEAL_STATUS_CHANGED,
      LOT_CREATED: item.LOT_CREATED,
      LOT_STATUS_CHANGED: item.LOT_STATUS_CHANGED,
      SYSTEM_INFO: item.SYSTEM_INFO,
      USER_PROFILE_CHANGED: item.USER_PROFILE_CHANGED,
      USER_REGISTERED: item.USER_REGISTERED,
      LOT_QUESTION_PUBLISHED: item.LOT_QUESTION_PUBLISHED,
      LOT_QUESTION_RECEIVED: item.LOT_QUESTION_RECEIVED,
    };
  }
}
