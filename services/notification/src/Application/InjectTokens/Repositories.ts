import { INotificationConfigRepository, INotificationRepository, INotificationRequestRepository } from '../../Domain';

export const NOTIFICATION_REQUEST_REPOSITORY = Symbol('NOTIFICATION_REQUEST_REPOSITORY');
export type NOTIFICATION_REQUEST_REPOSITORY = INotificationRequestRepository;

export const NOTIFICATION_REPOSITORY = Symbol('NOTIFICATION_REPOSITORY');
export type NOTIFICATION_REPOSITORY = INotificationRepository;

export const NOTIFICATION_CONFIG_REPOSITORY = Symbol('NOTIFICATION_CONFIG_REPOSITORY');
export type NOTIFICATION_CONFIG_REPOSITORY = INotificationConfigRepository;
