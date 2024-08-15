import { Bid, BidKey } from '../../../Resource';

export type BidArchivePayload = {
    id: BidKey['id'];
  };
export type BidArchiveResult = Bid;
