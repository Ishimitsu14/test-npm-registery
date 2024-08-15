import { ISnapshotEntity } from '@ddd/infra';
import { Collection, Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';

import { NotificationRecipientPK, NotificationRecipientType, NotificationRequest, NotificationRequestPK, NotificationType } from '../../../../../Domain';
import { NotificationSnapshot, NotificationTypeSnapshot } from '../../Notification/Snapshots';
import { NotificationRecipientTypeSnapshot } from './Enums';

@Entity({ tableName: 'notification_request' })
export class NotificationRequestSnapshot implements ISnapshotEntity<NotificationRequest> {
  @PrimaryKey({ fieldName: 'id', type: 'varchar' })
  id: string;

  @NotificationTypeSnapshot({ fieldName: 'type' })
  type: NotificationTypeSnapshot;

  @Property({ fieldName: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @Property({ fieldName: 'force', type: 'boolean' })
  force: boolean;

  @NotificationRecipientTypeSnapshot({ fieldName: 'recipient_type' })
  recipientType: NotificationRecipientTypeSnapshot;

  @Property({ fieldName: 'recipients', type: 'array' })
  recipients: string[];

  @Property({ fieldName: 'payload', type: 'jsonb' })
  payload: Record<string, any>;

  // References
  @OneToMany({ entity: () => NotificationSnapshot, mappedBy: (notification) => notification.notificationRequest })
  notifications = new Collection<NotificationSnapshot>(this);

  applyPK(primaryKey: NotificationRequestPK): void {
    this.id = primaryKey.id;
  }

  applyDomain(domain: NotificationRequest): void {
    this.id = domain.primaryKey.id;
    this.type = domain.type.id;
    this.createdAt = domain.createdAt;
    this.force = domain.force;
    this.recipientType = domain.recipientType.id;
    this.recipients = domain.recipients.map((m) => m.id);
    this.payload = domain.payload;
  }

  toDomain(): NotificationRequest {
    const primaryKey = NotificationRequestPK.fromSnapshot(this.id);
    const type = NotificationType.getById(this.type);
    const createdAt = this.createdAt;
    const force = Boolean(this.force);
    const recipientType = NotificationRecipientType.getById(this.recipientType);
    const recipients = this.recipients.map((recipient) => NotificationRecipientPK.fromSnapshot(recipient));
    const payload = this.payload;

    return NotificationRequest.fromSnapshot(primaryKey, type, createdAt, force, recipientType, recipients, payload);
  }
}
