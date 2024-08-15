import { Bid, BidKey } from '../../../Resource';

export namespace BidGetById {
  export type Payload = {
    id: BidKey['id'];
  };
  export type Result = Bid;
}
