import { ConstructorType } from '../../core';

export interface IMediatorNotification {}

export interface IMediatorNotificationTrigger<TNotification extends IMediatorNotification> {}

export type MediatorNotificationClass<T extends IMediatorNotification = IMediatorNotification> = ConstructorType<T>;
