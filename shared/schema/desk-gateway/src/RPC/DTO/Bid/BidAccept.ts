import { Bid, BidKey, UserKey } from '../../../Resource';

export type BidAcceptPayload = {
    id: BidKey['id'];
    userId: UserKey['id'];
  };
export type BidAcceptResult = Bid;
