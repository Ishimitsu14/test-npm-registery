import { Inject } from '@nestjs/common';
import { NotificationSchema } from '@schema/notification';

import { Notification, NotificationRequest, NotificationRequestPK } from '../../Domain';
import { CommonResourceMapper } from './CommonResourceMapper';

export class NotificationResourceMapper {
  @Inject(CommonResourceMapper)
  private commonResourceMapper: CommonResourceMapper;

  toNotificationRequestKey(notificationPK: NotificationRequestPK): Required<NotificationSchema.NotificationRequestPK> {
    return {
      resource: 'notification_request_key',
      notificationRequestId: notificationPK.id,
    };
  }

  toNotificationRequest(domain: NotificationRequest): Required<NotificationSchema.NotificationRequest> {
    return {
      resource: 'notification_request',
      notificationRequestId: domain.primaryKey.id,
      type: domain.type.id,
      createdAt: domain.createdAt.valueOf(),
      recipientType: domain.recipientType.id,
      recipients: domain.recipients.map((m) => this.commonResourceMapper.toNotificationRecipientPK(m)),
      payload: domain.payload as NotificationSchema.NotificationPayload<NotificationSchema.NotificationType>,
    };
  }

  toNotification(notification: Notification, notificationRequest: NotificationRequest): Required<NotificationSchema.Notification> {
    return {
      resource: 'notification',
      notificationRequestKey: this.toNotificationRequestKey(notification.primaryKey.notificationRequestPK),
      recipientKey: this.commonResourceMapper.toNotificationRecipientPK(notification.primaryKey.recipientPK),
      type: notificationRequest.type.id,
      createdAt: notification.createdAt.valueOf(),
      payload: notificationRequest.payload as NotificationSchema.NotificationPayload<NotificationSchema.NotificationType>,
      isReaded: notification.isReaded,
    };
  }
}
