import { ISnapshotEntity } from '@ddd/infra';
import { Entity, ManyToOne, PrimaryKey, PrimaryKeyProp, Property, Ref, Reference } from '@mikro-orm/core';

import { Notification, NotificationPK, NotificationRecipientPK, NotificationRequestPK } from '../../../../../Domain';
import { NotificationRequestSnapshot } from '../../NotificationRequest';

@Entity({ tableName: 'notification' })
export class NotificationSnapshot implements ISnapshotEntity<Notification> {
  @PrimaryKey({ fieldName: 'recipient_id', type: 'varchar' })
  recipientId: string;

  [PrimaryKeyProp]?: ['recipientId', 'notificationRequest'];

  @Property({ fieldName: 'is_readed', type: 'bool' })
  isReaded: boolean;

  @Property({ fieldName: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  // References
  @ManyToOne({ entity: () => NotificationRequestSnapshot, ref: true, primary: true, fieldName: 'notification_request_id' })
  notificationRequest: Ref<NotificationRequestSnapshot>;

  applyPK(primaryKey: NotificationPK): void {
    this.recipientId = primaryKey.recipientPK.id;
    this.notificationRequest = Reference.createFromPK(NotificationRequestSnapshot, primaryKey.notificationRequestPK.id);
  }

  applyDomain(domain: Notification): void {
    this.isReaded = domain.isReaded;
    this.createdAt = domain.createdAt;
  }

  toDomain(): Notification {
    const primaryKey = NotificationPK.fromSnapshot(NotificationRecipientPK.fromSnapshot(this.recipientId), NotificationRequestPK.fromSnapshot(this.notificationRequest.id));
    const isReaded = this.isReaded;
    const createdAt = this.createdAt;

    return Notification.fromSnapshot(primaryKey, isReaded, createdAt);
  }
}
