import { NotificationListFilter } from './NotificationList';
export declare namespace NotificationMakeRead {
    type Payload = {
        filter: NotificationListFilter;
        isReaded: boolean;
    };
    type Result = void;
}
