import { RuntimeError } from '@ddd/errors';

export interface NotificationNotFoundErrorParams {
  id: string;
}

@RuntimeError.RegisterError('NotificationNotFoundError')
export class NotificationNotFoundError extends RuntimeError<NotificationNotFoundErrorParams> {
  constructor(id: string) {
    super('NotificationNotFoundError', { id });
  }

  get message(): string {
    return `Notification with id ${this.params.id} not found`;
  }
}
