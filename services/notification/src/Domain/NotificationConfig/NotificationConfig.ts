import { AggregateRoot } from '@ddd/domain';

import { NotificationType } from '../Notification';
import { NotificationRecipientPK } from '../NotificationRecipientPK';

export class NotificationConfig extends AggregateRoot<NotificationRecipientPK> {
  static createDefault(ownerPK: NotificationRecipientPK) {
    const defaultConfig = NotificationType.getDefaults();
    return new NotificationConfig(ownerPK, defaultConfig);
  }

  static fromSnapshot(recipientPK: NotificationRecipientPK, settings: Map<NotificationType, boolean>) {
    const defaultSettings = NotificationType.getDefaults();
    const defaultKeys = defaultSettings.keys();
    for (const key of defaultKeys) {
      if (!settings.has(key)) settings.set(key, defaultSettings.get(key));
    }
    return new NotificationConfig(recipientPK, settings);
  }

  public readonly primaryKey: NotificationRecipientPK;
  private _settings: Map<NotificationType, boolean>;

  private constructor(primaryKey: NotificationRecipientPK, settings: Map<NotificationType, boolean>) {
    super();

    this.primaryKey = primaryKey;
    this._settings = settings;
  }

  get settings(): ReadonlyMap<NotificationType, boolean> {
    return this._settings;
  }

  updateSettings(map: ReadonlyMap<NotificationType, boolean>) {
    [...map.entries()].forEach(([key, value]) => {
      this._settings.set(key, value);
    });
  }
}
