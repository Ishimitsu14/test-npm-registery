import { Bid } from '../Bid';
import { Deal } from '../Deal';
import { Lot } from '../Lot';
import { LotQuestion } from '../LotQuestion';
import { User } from '../User';
import { NotificationType } from './Enums';
export type NotificationPayload<Type extends NotificationType> = NotificationPayloadMap[Type];
export interface NotificationPayloadMap {
    SYSTEM_INFO: {
        text: string;
    };
    DEAL_CREATED: {
        deal: Deal;
    };
    DEAL_STATUS_CHANGED: {
        deal: Deal;
    };
    LOT_CREATED: {
        lot: Lot;
    };
    LOT_STATUS_CHANGED: {
        lot: Lot;
    };
    BID_RECEIVED: {
        bid: Bid;
    };
    BID_STATUS_CHANGED: {
        bid: Bid;
    };
    USER_REGISTERED: {
        user: User;
    };
    USER_PROFILE_CHANGED: {
        user: User;
    };
    LOT_QUESTION_RECEIVED: {
        lotQuestion: LotQuestion;
    };
    LOT_QUESTION_PUBLISHED: {
        lotQuestion: LotQuestion;
    };
}
