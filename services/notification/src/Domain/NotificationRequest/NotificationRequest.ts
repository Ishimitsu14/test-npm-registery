import { NullableObject } from '@ddd/core';
import { AggregateRoot } from '@ddd/domain';

import { Notification, NotificationPK, NotificationType } from '../Notification';
import { NotificationConfig } from '../NotificationConfig';
import { NotificationRecipientPK } from '../NotificationRecipientPK';
import { NotificationRecipientType } from './Enums';
import { NotificationRequestCreatedEvent } from './Events';
import { NotificationRequestPK } from './NotificationRequestPK';

export class NotificationRequest extends AggregateRoot<NotificationRequestPK> {
  static create(
    primaryKey: NotificationRequestPK,
    type: NotificationType,
    payload: Record<string, any>,
    force: boolean,
    recipientType: NotificationRecipientType,
    recipients: NotificationRecipientPK[],
  ) {
    const notificationRequest = new NotificationRequest(primaryKey, type, new Date(), force, recipientType, recipients, payload);
    notificationRequest.addEvent(new NotificationRequestCreatedEvent(notificationRequest));

    return notificationRequest;
  }

  static fromSnapshot(
    primaryKey: NotificationRequestPK,
    type: NotificationType,
    createdAt: Date,
    force: boolean,
    recipientType: NotificationRecipientType,
    recipients: NotificationRecipientPK[],
    payload: Record<string, any>,
  ) {
    return new NotificationRequest(primaryKey, type, createdAt, force, recipientType, recipients, payload);
  }

  protected constructor(
    readonly primaryKey: NotificationRequestPK,
    readonly type: NotificationType,
    readonly createdAt: Date,
    readonly force: boolean,
    readonly recipientType: NotificationRecipientType,
    readonly recipients: NotificationRecipientPK[],
    readonly payload: Record<string, any>,
  ) {
    super();
  }

  isConfigSupported(config: NotificationConfig): boolean {
    return config.settings.get(this.type);
  }

  createNotifications(configs: NotificationConfig[]): Notification[] {
    return configs
      .map((config) => {
        if (this.force || this.isConfigSupported(config)) {
          const notificationPK = NotificationPK.create(config.primaryKey, this.primaryKey);
          return Notification.create(notificationPK);
        }
        return NullableObject;
      })
      .filter(NullableObject.hasValue);
  }
}
