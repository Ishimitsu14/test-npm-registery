import { NotificationList } from './NotificationList';

export namespace NotificationMakeRead {
  export type Payload = {
    filter: NotificationList.Filter;
    isReaded: boolean;
  };
  export type Result = void;
}
