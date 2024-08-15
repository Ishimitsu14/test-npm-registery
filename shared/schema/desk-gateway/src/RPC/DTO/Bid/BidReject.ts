import { Bid, BidKey } from '../../../Resource';

export type BidRejectPayload = {
    id: BidKey['id'];
    reason: string;
  };
export type BidRejectResult = Bid;
