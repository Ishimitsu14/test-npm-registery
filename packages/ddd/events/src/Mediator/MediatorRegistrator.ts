import { ConstructorType } from '@ddd/core';

import { MEDIATOR_TRIGGER_NOTIFICATION_TYPES } from './const';
import { IMediatorNotification, IMediatorNotificationTrigger, MediatorNotificationClass } from './IMediatorNotification';

export interface NotificationEntry<T extends IMediatorNotification> {
  type: MediatorNotificationClass<T>;
  trigger: IMediatorNotificationTrigger<T>;
  triggerClass: ConstructorType<IMediatorNotificationTrigger<T>>;
}

export class MediatorRegistrator<TNotification extends IMediatorNotification> {
  private readonly _entries: NotificationEntry<TNotification>[] = [];

  get entries(): ReadonlyArray<NotificationEntry<TNotification>> {
    return this._entries.slice();
  }

  registerTrigger(trigger: IMediatorNotificationTrigger<TNotification>) {
    const triggerClass = trigger?.constructor;
    if (!triggerClass) return;

    const types: MEDIATOR_TRIGGER_NOTIFICATION_TYPES = Reflect.getMetadata(MEDIATOR_TRIGGER_NOTIFICATION_TYPES, triggerClass) || [];
    if (types.length <= 0) return;

    for (const type of types) {
      const existsIndex = this._entries.findIndex((entry) => entry.triggerClass === triggerClass && entry.trigger === trigger && entry.type === type);
      if (existsIndex === -1) {
        this._entries.push({ type: <MediatorNotificationClass<TNotification>>type, trigger, triggerClass });
      }
    }
  }

  registerTriggerMany(triggers: IMediatorNotificationTrigger<TNotification>[]) {
    for (const trigger of triggers) {
      this.registerTrigger(trigger);
    }
  }

  resolveTriggersByNotificationType<T extends IMediatorNotificationTrigger<T>>(type: MediatorNotificationClass<TNotification>) {
    return this._entries.filter((m) => m.type === type).map((m) => m.trigger) as T[];
  }

  resolveTriggersByNotification<T extends IMediatorNotificationTrigger<T>>(type: TNotification) {
    return this.resolveTriggersByNotificationType<T>(type?.constructor);
  }
}
