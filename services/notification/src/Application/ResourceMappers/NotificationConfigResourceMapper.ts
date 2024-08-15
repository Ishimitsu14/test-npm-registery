import { Inject } from '@nestjs/common';
import { NotificationSchema } from '@schema/notification';

import { NotificationConfig, NotificationType } from '../../Domain';
import { CommonResourceMapper } from './CommonResourceMapper';

export class NotificationConfigResourceMapper {
  @Inject(CommonResourceMapper)
  private commonResourceMapper: CommonResourceMapper;

  toNotificationConfig(domain: NotificationConfig): Required<NotificationSchema.NotificationConfig> {
    return {
      resource: 'notification_config',
      recipientKey: this.commonResourceMapper.toNotificationRecipientPK(domain.primaryKey),
      settings: this.toNotifiationTypesSettings(domain.settings),
    };
  }

  private toNotifiationTypesSettings(settings: ReadonlyMap<NotificationType, boolean>): Required<NotificationSchema.NotificationConfigSettings> {
    return {
      SYSTEM_INFO: settings.get(NotificationType.SYSTEM_INFO),
      DEAL_CREATED: settings.get(NotificationType.DEAL_CREATED),
      DEAL_STATUS_CHANGED: settings.get(NotificationType.DEAL_STATUS_CHANGED),
      LOT_CREATED: settings.get(NotificationType.LOT_CREATED),
      LOT_STATUS_CHANGED: settings.get(NotificationType.LOT_STATUS_CHANGED),
      BID_RECEIVED: settings.get(NotificationType.BID_RECEIVED),
      BID_STATUS_CHANGED: settings.get(NotificationType.BID_STATUS_CHANGED),
      USER_PROFILE_CHANGED: settings.get(NotificationType.USER_PROFILE_CHANGED),
      USER_REGISTERED: settings.get(NotificationType.USER_REGISTERED),
      LOT_QUESTION_PUBLISHED: settings.get(NotificationType.LOT_QUESTION_PUBLISHED),
      LOT_QUESTION_RECEIVED: settings.get(NotificationType.LOT_QUESTION_RECEIVED),
    };
  }
}
