import { Bid, BidKey } from '../../../Resource';

export type BidMakeActivePayload = {
    id: BidKey['id'];
    userId: string;
  };
export type BidMakeActiveResult = Bid;
