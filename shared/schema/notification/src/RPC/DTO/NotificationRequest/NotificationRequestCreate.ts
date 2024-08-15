import { NotificationPayload, NotificationRecipientPK, NotificationRecipientType, NotificationRequestPK, NotificationType } from '../../../Resource';

export namespace NotificationRequestCreate {
  export type Payload<Type extends NotificationType> = {
    type: Type;
    recipientType: NotificationRecipientType;
    recipients?: NotificationRecipientPK['id'][];
    payload: NotificationPayload<Type>;
    force?: boolean; // Если указано как true, тогда даже если пользователь не желал получать это уведомление, мы его отправим
  };
  export type Result = NotificationRequestPK;
}
