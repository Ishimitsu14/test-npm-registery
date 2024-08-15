import { BidKey, BidRejectReasonType } from '../../../Resource';

export namespace BidReject {
  export type Payload = {
    id: BidKey['id'];
    reason: BidRejectReasonType;
  };
  export type Result = void;
}
