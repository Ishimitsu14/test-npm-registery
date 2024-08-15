import { NullableObject } from '@ddd/core';
import { EnumerationID } from '@ddd/domain';
import { ISnapshotEntity } from '@ddd/infra';
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

import { NotificationConfig, NotificationRecipientPK, NotificationType } from '../../../../../Domain';

@Entity({ tableName: 'notification_config' })
export class NotificationConfigSnapshot implements ISnapshotEntity<NotificationConfig> {
  @PrimaryKey({ fieldName: 'id', type: 'varchar' })
  id: string;

  @Property({ fieldName: 'settings', type: 'json', default: '{}' })
  settings: Record<EnumerationID<NotificationType>, boolean>;

  applyPK(primaryKey: NotificationRecipientPK): void {
    this.id = primaryKey.id;
  }

  applyDomain(domain: NotificationConfig): void {
    this.id = domain.primaryKey.id;
    this.settings = [...domain.settings.entries()].reduce((out, [key, value]) => ({ ...out, [key.id]: value }), {} as Record<EnumerationID<NotificationType>, boolean>);
  }

  toDomain(): NotificationConfig {
    const recipientPK = NotificationRecipientPK.fromSnapshot(this.id);
    const settings = Object.keys(this.settings).reduce((out, key: EnumerationID<NotificationType>) => {
      const type = NotificationType.getById(key);
      if (NullableObject.hasValue(type)) out.set(type, Boolean(this.settings[key]));

      return out;
    }, new Map<NotificationType, boolean>());

    return NotificationConfig.fromSnapshot(recipientPK, settings);
  }
}
