import { Bid, BidKey } from '../../../Resource';
export type BidMakeActivePayload = {
    id: BidKey['id'];
};
export type BidMakeActiveResult = Bid;
