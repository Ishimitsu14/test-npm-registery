import { Bid, BidKey, BidRejectReasonType } from '../../../Resource';
export type BidRejectPayload = {
    id: BidKey['id'];
    reason: BidRejectReasonType;
};
export type BidRejectResult = Bid;
