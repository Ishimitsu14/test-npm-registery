import { RuntimeError } from '@ddd/errors';

export interface NotificationOwnerInfoNotFoundErrorParams {
  notificationId: string;
}

@RuntimeError.RegisterError('NotificationOwnerInfoNotFoundError')
export class NotificationOwnerInfoNotFoundError extends RuntimeError<NotificationOwnerInfoNotFoundErrorParams> {
  constructor(notificationId: string) {
    super('NotificationOwnerInfoNotFoundError', { notificationId });
  }

  get message(): string {
    return `NotificationOwnerInfo for notification with id ${this.params.notificationId} not found`;
  }
}
