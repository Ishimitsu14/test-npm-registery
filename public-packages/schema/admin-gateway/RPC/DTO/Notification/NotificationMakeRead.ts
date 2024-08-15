import { NotificationListFilter } from './NotificationList';

export namespace NotificationMakeRead {
  export type Payload = {
    filter: NotificationListFilter;
    isReaded: boolean;
  };
  export type Result = void;
}
