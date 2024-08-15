import { BidKey } from '../../../Resource';

export namespace BidAccept {
  export type Payload = {
    id: BidKey['id'];
    userId: string;
  };
  export type Result = void;
}
