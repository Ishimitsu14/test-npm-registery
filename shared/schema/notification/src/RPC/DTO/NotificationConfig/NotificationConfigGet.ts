import { NotificationConfig, NotificationRecipientPK } from '../../../Resource';

export namespace NotificationConfigGet {
  export type Payload = {
    recipientId: NotificationRecipientPK['id'];
  };
  export type Result = NotificationConfig;
}
